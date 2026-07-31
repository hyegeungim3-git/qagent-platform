import React, { useState } from "react";
import {
  BarChart2, Upload, FileSpreadsheet, TrendingUp, Play, RotateCcw, ChevronRight,
  CheckCircle, Loader2, Radio, Network, Download, Copy, Table2,
  Activity, Filter, Cpu, Zap, AlertCircle, ArrowUpDown, FileText
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell, LabelList, ReferenceLine
} from "recharts";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { cn, downloadTextFile } from "../../utils.jsx";


const AGENTS=[
  {icon:FileSpreadsheet, label:'데이터 파싱 에이전트', sub:'CSV/Excel 구조 파악·정제 중', color:'bg-orange-500', ms:1100},
  {icon:Activity,        label:'통계 분석 에이전트',  sub:'기술통계·분포·이상치 분석 중', color:'bg-amber-500',  ms:2000},
  {icon:BarChart2,       label:'시각화 에이전트',     sub:'차트·그래프 자동 생성 중',     color:'bg-rose-500',   ms:1300},
];

const SAMPLE_FILES=[
  {id:'f1',name:'공시지가_변동현황_2026Q1.xlsx',rows:1248,cols:12,size:'2.4MB'},
  {id:'f2',name:'이의신청_접수현황_2025.csv',  rows:342, cols:8, size:'0.8MB'},
  {id:'f3',name:'현장조사_실적_2026.xlsx',     rows:89,  cols:15,size:'0.5MB'},
];

/* 차트 데이터 */
const PRICE_TREND=[
  {month:'2025.7', 매매:98.12,전세:99.01,월세:101.34},
  {month:'2025.8', 매매:97.95,전세:98.88,월세:101.51},
  {month:'2025.9', 매매:97.71,전세:98.65,월세:101.68},
  {month:'2025.10',매매:97.44,전세:98.43,월세:101.79},
  {month:'2025.11',매매:97.22,전세:98.21,월세:101.85},
  {month:'2025.12',매매:97.05,전세:98.08,월세:101.90},
  {month:'2026.1', 매매:96.91,전세:97.95,월세:101.95},
  {month:'2026.2', 매매:96.83,전세:97.88,월세:102.01},
  {month:'2026.3', 매매:96.74,전세:97.77,월세:102.08},
];

const REGION_BAR=[
  {region:'서울',  변동률:0.12},
  {region:'경기',  변동률:-0.47},
  {region:'인천',  변동률:-0.91},
  {region:'부산',  변동률:-0.38},
  {region:'대구',  변동률:-0.55},
  {region:'광주',  변동률:-0.22},
  {region:'대전',  변동률:-0.18},
  {region:'울산',  변동률:-0.33},
];

const APPEAL_MONTHLY=[
  {month:'1월',접수:28,처리:24,미결:4},
  {month:'2월',접수:35,처리:31,미결:8},
  {month:'3월',접수:42,처리:38,미결:12},
];

const STATS_TABLE=[
  {metric:'평균 공시지가',value:'3,842,000원/㎡',change:'+2.3%',status:'normal'},
  {metric:'표준편차',      value:'1,204,000원/㎡',change:'-0.8%',status:'normal'},
  {metric:'최대값',        value:'18,500,000원/㎡',change:'+5.1%',status:'high'},
  {metric:'최솟값',        value:'82,000원/㎡',   change:'+1.2%',status:'normal'},
  {metric:'이상치 건수',   value:'23건',            change:'+2건', status:'warning'},
  {metric:'결측치',        value:'0건',             change:'유지', status:'normal'},
];

const STATUS_COLORS={normal:'text-slate-600',high:'text-rose-600',warning:'text-amber-600'};
const STATUS_BG   ={normal:'bg-slate-50',   high:'bg-rose-50',    warning:'bg-amber-50'};

/* 도메인 이관: REB 기본 콘텐츠 — 도메인 팩 agentContent["agent-dataanalysis"]로 키 단위 오버라이드 */
export const CONTENT_DEFAULTS={
  sampleFiles: SAMPLE_FILES,                       // {id,name,rows,cols,size}[3]
  trendCaption:'주택가격지수 추세 (2025.7 ~ 2026.3) · 기준: 2021년 6월=100',
  trendData: PRICE_TREND,                          // {month,...seriesKey}[9]
  trendSeries:[{key:'매매',color:'#f97316'},{key:'전세',color:'#3b82f6'},{key:'월세',color:'#10b981'}],
  trendDomain:[96,103], trendRef:100, trendRefLabel:'기준(100)',
  barTabLabel:'지역별',
  barCaption:'지역별 공시지가 변동률 (2026.3 기준) · 단위: %',
  barData: REGION_BAR, barXKey:'region', barValueKey:'변동률', barUnit:'%',
  stackTabLabel:'이의신청',
  stackCaption:'이의신청 접수·처리·미결 현황 (2026년 분기) · 단위: 건',
  stackData: APPEAL_MONTHLY, stackSeries:[{key:'접수',color:'#f97316'},{key:'처리',color:'#10b981'},{key:'미결',color:'#ef4444'}],
  statsTable: STATS_TABLE,                         // {metric,value,change,status}[6]
  outlierSummary:'23건 (1.8%)',
  docStandard:'KREA 표준 형식',
  docStandardNote:'리포트 형식을 선택하면 KREA 표준 양식으로 자동 생성됩니다',
};

const DataAnalysisAgent=({onBack,domain})=>{
  const C={...CONTENT_DEFAULTS,...(domain?.agentContent?.["agent-dataanalysis"]||{})};
  const [step,setStep]=useState(1);
  const [selectedFile,setSelectedFile]=useState('f1');
  const [analysisType,setAnalysisType]=useState('comprehensive');
  const [agentIdx,setAgentIdx]=useState(-1);
  const [doneIdx,setDoneIdx]=useState([]);
  const [chartTab,setChartTab]=useState('trend');
  const [bulkMode,setBulkMode]=useState(false);
  const [downloaded,setDownloaded]=useState(false);

  /* 통계 요약 + 현재 보고 있는 차트의 원본 데이터를 엑셀(TSV)로 — 화면에 없는 값은 넣지 않는다 */
  const downloadResult=()=>{
    const rows=[['[통계 요약]'],['지표','값','전기 대비'],
      ...C.statsTable.map(s=>[s.metric,s.value,s.change]),['']];
    // 탭 키는 trend | region | appeal (렌더 조건과 동일하게 맞출 것)
    const chart=chartTab==='region'?{title:C.barCaption,data:C.barData}
      :chartTab==='appeal'?{title:C.stackCaption,data:C.stackData}
      :{title:C.trendCaption,data:C.trendData};
    if(chart.data?.length){
      rows.push([`[${chart.title}]`],Object.keys(chart.data[0]),
        ...chart.data.map(d=>Object.values(d)));
    }
    downloadTextFile('분석결과.xls',rows.map(r=>r.join('\t')).join('\n'),
      'text/tab-separated-values;charset=utf-8');
    setDownloaded(true);
    setTimeout(()=>setDownloaded(false),2000);
  };

  const startAnalysis=()=>{
    setStep(2);setAgentIdx(0);setDoneIdx([]);
    let delay=0;
    AGENTS.forEach((ag,i)=>{
      delay+=ag.ms;
      setTimeout(()=>{
        setAgentIdx(i+1<AGENTS.length?i+1:-1);
        setDoneIdx(p=>[...p,i]);
        if(i===AGENTS.length-1)setTimeout(()=>setStep(3),600);
      },delay);
    });
  };

  const reset=()=>{setStep(1);setAgentIdx(-1);setDoneIdx([]);setChartTab('trend');};

  const file=C.sampleFiles.find(f=>f.id===selectedFile);

  if(step===1)return(
    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          {onBack&&<button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-[11px] font-bold flex items-center gap-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5 rotate-180"/>뒤로
          </button>}
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shrink-0">
            <BarChart2 className="w-5 h-5 text-white"/>
          </div>
          <div>
            <div className="text-[15px] font-black text-slate-800">데이터 분석 에이전트</div>
            <div className="text-xs text-slate-400">Excel/CSV 업로드 → 통계 분석 → 자동 시각화</div>
          </div>
        </div>

        {/* 파일 업로드 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">1 · 데이터 파일 선택</label>
          <div className="border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/30 px-6 py-5 text-center hover:bg-orange-50/60 transition-colors cursor-pointer group">
            <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2 group-hover:text-orange-600 transition-colors"/>
            <p className="text-[13px] font-bold text-slate-600">Excel / CSV 파일을 업로드하거나</p>
            <p className="text-[11px] text-slate-400 mt-1">샘플 데이터를 선택해서 분석을 시작하세요</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500">또는 샘플 파일 선택</p>
            {C.sampleFiles.map(f=>(
              <label key={f.id} className={cn(
                'flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all select-none',
                selectedFile===f.id?'bg-orange-50 border-orange-300':'border-slate-200 hover:bg-slate-50'
              )}>
                <input type="radio" name="file" value={f.id} checked={selectedFile===f.id} onChange={()=>setSelectedFile(f.id)} className="accent-orange-600 shrink-0"/>
                <FileSpreadsheet className={cn('w-5 h-5 shrink-0',selectedFile===f.id?'text-orange-600':'text-slate-400')}/>
                <div className="flex-1 min-w-0">
                  <div className={cn('text-[13px] font-bold truncate',selectedFile===f.id?'text-slate-800':'text-slate-500')}>{f.name}</div>
                  <div className="text-[10px] text-slate-400">{f.rows.toLocaleString()}행 × {f.cols}열 · {f.size}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 대량 데이터 모드 */}
        <label className={cn(
          'flex items-center gap-3 px-4 py-2.5 border-2 rounded-xl cursor-pointer transition-all select-none',
          bulkMode?'border-orange-400 bg-orange-50':'border-slate-200 hover:border-orange-200 bg-white'
        )}>
          <input type="checkbox" checked={bulkMode} onChange={e=>setBulkMode(e.target.checked)} className="accent-orange-600 w-4 h-4 shrink-0"/>
          <div>
            <span className={cn('text-[13px] font-bold',bulkMode?'text-orange-700':'text-slate-700')}>대량 데이터 모드</span>
            <span className="text-[10px] text-slate-400 ml-2">10만 건 이상 데이터 최적화 처리</span>
          </div>
          {bulkMode&&<span className="ml-auto text-[10px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full shrink-0">활성</span>}
        </label>

        {/* 분석 유형 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">2 · 분석 유형</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {id:'comprehensive', label:'종합 분석', desc:'기술통계 + 분포 + 이상치 + 시각화 전체'},
              {id:'stats',         label:'기술통계',  desc:'평균·분산·분위수·상관관계'},
              {id:'trend',         label:'추세 분석', desc:'시계열 트렌드·계절성 분석'},
              {id:'outlier',       label:'이상치 탐지',desc:'Z-score·IQR 기반 이상치 검출'},
            ].map(t=>(
              <label key={t.id} className={cn(
                'flex flex-col px-4 py-3 border rounded-xl cursor-pointer transition-all select-none',
                analysisType===t.id?'bg-orange-50 border-orange-300':'border-slate-200 hover:bg-slate-50'
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <input type="radio" name="atype" value={t.id} checked={analysisType===t.id} onChange={()=>setAnalysisType(t.id)} className="accent-orange-600"/>
                  <span className={cn('text-[13px] font-bold',analysisType===t.id?'text-slate-800':'text-slate-500')}>{t.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 pl-5">{t.desc}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={startAnalysis}
          className="w-full py-3.5 bg-orange-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100 text-[15px]">
          <Play className="w-4 h-4 fill-white"/> 데이터 분석 시작
        </button>
      </div>
    </div>
  );

  if(step===2)return(
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl px-6">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-100">
              <Radio className="w-7 h-7 text-white animate-pulse"/>
            </div>
            <div className="text-[18px] font-black text-slate-800">데이터 분석 파이프라인 처리 중</div>
            <div className="text-sm text-slate-400 mt-1">{file?.name} · {file?.rows.toLocaleString()}행 데이터 분석 중</div>
          </div>
          <div className="space-y-3">
            {AGENTS.map((ag,i)=>{
              const isDone=doneIdx.includes(i);
              const isActive=agentIdx===i;
              const AgIcon=ag.icon;
              return(
                <div key={i}>
                  <div className={cn(
                    'rounded-2xl border-2 p-4 transition-all duration-500',
                    isDone?'border-emerald-200 bg-emerald-50/60':
                    isActive?'border-orange-300 bg-orange-50 shadow-md shadow-orange-100':
                    'border-slate-100 bg-white opacity-50'
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all',
                        isDone?'bg-emerald-500':isActive?ag.color:'bg-slate-200')}>
                        {isDone?<CheckCircle className="w-5 h-5 text-white"/>
                          :<AgIcon className={cn('w-5 h-5',isActive?'text-white animate-pulse':'text-slate-400')}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn('font-black text-sm',isDone?'text-emerald-700':isActive?'text-orange-700':'text-slate-400')}>{ag.label}</div>
                        <div className={cn('text-xs mt-0.5',isDone?'text-emerald-500':isActive?'text-orange-500':'text-slate-300')}>
                          {isActive?`처리 중 — ${ag.sub}`:isDone?`완료 — ${ag.sub}`:ag.sub}
                        </div>
                      </div>
                      {isActive&&<Loader2 className="w-4 h-4 text-orange-500 animate-spin shrink-0"/>}
                      {isDone&&<span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">완료</span>}
                    </div>
                    {isActive&&<div className="mt-3"><div className="h-1 bg-orange-100 rounded-full overflow-hidden"><div className="h-1 bg-orange-500 rounded-full animate-pulse" style={{width:'55%'}}/></div></div>}
                  </div>
                  {i<AGENTS.length-1&&<div className="flex justify-center my-1"><ChevronRight className="w-4 h-4 text-slate-300 rotate-90"/></div>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            <Cpu className="w-3.5 h-3.5 inline mr-1 text-orange-400"/>
            AI 통계 분석 파이프라인 — 정형 데이터를 자동으로 분석하고 시각화합니다
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-80 shrink-0 border-l border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 overflow-y-auto custom-scrollbar flex-col">
        <AgentWorkflowPanel agentId="agent-dataanalysis" activeStep={agentIdx} doneSteps={doneIdx} />
      </div>
    </div>
  );

  /* ── STEP 3: 결과 ── */
  return(
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b px-5 py-2.5 flex items-center gap-2 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0"><CheckCircle className="w-3.5 h-3.5 text-white"/></div>
          <div className="min-w-0">
            <div className="text-[13px] font-black text-slate-800 truncate">분석 완료 · {file?.rows.toLocaleString()}행</div>
            <div className="text-[10px] text-slate-400">{file?.name} · 분석 시간 4.4초</div>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-colors">
          <RotateCcw className="w-3 h-3"/>새 분석
        </button>
        <button onClick={downloadResult}
          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors shadow-sm text-white',
            downloaded?'bg-emerald-600 hover:bg-emerald-700':'bg-orange-500 hover:bg-orange-600')}>
          <Download className="w-3 h-3"/>{downloaded?'내려받음':'결과 다운로드'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* 통계 요약 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {label:'총 데이터',value:`${file?.rows.toLocaleString()}행`,color:'text-orange-700',bg:'bg-orange-50 border-orange-200'},
            {label:'분석 열',  value:`${file?.cols}개`,                color:'text-blue-700',  bg:'bg-blue-50 border-blue-200'},
            {label:'이상치',   value:C.outlierSummary,                 color:'text-amber-600', bg:'bg-amber-50 border-amber-200'},
            {label:'결측치',   value:'0건',                            color:'text-emerald-600',bg:'bg-emerald-50 border-emerald-200'},
          ].map(({label,value,color,bg})=>(
            <div key={label} className={cn('border rounded-xl px-4 py-3 text-center',bg)}>
              <div className={cn('text-[16px] font-black',color)}>{value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* 기술 통계 테이블 */}
        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b flex items-center gap-2">
            <Table2 className="w-4 h-4 text-orange-600"/>
            <span className="text-[13px] font-black text-slate-800">기술 통계 요약</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-slate-50 border-b">
                  {['지표','값','전기 대비','상태'].map(h=>(
                    <th key={h} className="px-4 py-2.5 text-left font-black text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {C.statsTable.map((r,i)=>(
                  <tr key={i} className={cn('border-b last:border-0',STATUS_BG[r.status])}>
                    <td className="px-4 py-2.5 font-medium text-slate-700">{r.metric}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-800 font-bold">{r.value}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-500">{r.change}</td>
                    <td className="px-4 py-2.5">
                      {r.status==='warning'?<span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3"/>주의</span>
                       :r.status==='high'?<span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold w-fit flex items-center gap-1"><TrendingUp className="w-3 h-3"/>높음</span>
                       :<span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold w-fit">정상</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 차트 탭 */}
        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b flex items-center gap-3">
            <BarChart2 className="w-4 h-4 text-orange-600"/>
            <span className="text-[13px] font-black text-slate-800">시각화</span>
            <div className="ml-auto flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              {[
                {key:'trend', label:'추세'},
                {key:'region', label:C.barTabLabel},
                {key:'appeal', label:C.stackTabLabel},
              ].map(({key,label})=>(
                <button key={key} onClick={()=>setChartTab(key)}
                  className={cn('px-3 py-1 rounded-md text-[11px] font-bold transition-all',
                    chartTab===key?'bg-white text-orange-700 shadow-sm':'text-slate-500 hover:text-slate-700')}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            {chartTab==='trend'&&(
              <>
                <p className="text-[11px] text-slate-400 font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-500"/>
                  {C.trendCaption}
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={C.trendData} margin={{top:5,right:20,left:-10,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                    <XAxis dataKey="month" tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false}/>
                    <YAxis domain={C.trendDomain} tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                    <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:'1px solid #e2e8f0'}}/>
                    <Legend wrapperStyle={{fontSize:11}}/>
                    {C.trendRef!=null&&<ReferenceLine y={C.trendRef} stroke="#94a3b8" strokeDasharray="4 4" label={{value:C.trendRefLabel,position:'right',fontSize:9,fill:'#94a3b8'}}/>}
                    {C.trendSeries.map(s=>(
                      <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} dot={false}/>
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
            {chartTab==='region'&&(
              <>
                <p className="text-[11px] text-slate-400 font-bold mb-4 flex items-center gap-2">
                  <BarChart2 className="w-3.5 h-3.5 text-orange-500"/>
                  {C.barCaption}
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={C.barData} margin={{top:5,right:20,left:-10,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                    <XAxis dataKey={C.barXKey} tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                    <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:'1px solid #e2e8f0'}} formatter={(v)=>[`${v}${C.barUnit}`,C.barValueKey]}/>
                    <ReferenceLine y={0} stroke="#94a3b8"/>
                    <Bar dataKey={C.barValueKey} radius={[4,4,0,0]}>
                      {C.barData.map((entry,index)=>(
                        <Cell key={index} fill={entry[C.barValueKey]>=0?'#10b981':'#f97316'}/>
                      ))}
                      <LabelList dataKey={C.barValueKey} position="top" style={{fontSize:10,fill:'#64748b'}} formatter={v=>`${v}${C.barUnit}`}/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
            {chartTab==='appeal'&&(
              <>
                <p className="text-[11px] text-slate-400 font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-orange-500"/>
                  {C.stackCaption}
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={C.stackData} margin={{top:5,right:20,left:-10,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                    <XAxis dataKey="month" tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                    <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:'1px solid #e2e8f0'}}/>
                    <Legend wrapperStyle={{fontSize:11}}/>
                    {C.stackSeries.map(s=>(
                      <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[3,3,0,0]}>
                        <LabelList dataKey={s.key} position="top" style={{fontSize:10}}/>
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </div>

        {/* 표준화 분석 리포트 자동 생성 */}
        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-600"/>
            <span className="text-[13px] font-black text-slate-800">표준화 분석 리포트 자동 생성</span>
            <span className="ml-auto text-[10px] text-slate-400">{C.docStandard}</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                {label:'요약 리포트',    desc:'1페이지 핵심 요약',    icon:'📄'},
                {label:'상세 분석 보고서',desc:'통계+차트+인사이트', icon:'📊'},
                {label:'이상치 보고서',  desc:'이상치 및 데이터 품질',icon:'⚠️'},
              ].map((r,i)=>(
                <button key={i}
                  onClick={()=>alert(`${r.label} 생성 준비 중...`)}
                  className="border-2 border-dashed border-orange-200 rounded-xl p-4 text-center hover:bg-orange-50 hover:border-orange-400 transition-all">
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-[12px] font-black text-slate-700">{r.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 text-center">{C.docStandardNote}</p>
          </div>
        </div>

        <div className="text-center py-2">
          <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-[13px] font-black hover:bg-orange-600 transition-colors shadow-md shadow-orange-100">
            <RotateCcw className="w-4 h-4"/>새 분석
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisAgent;

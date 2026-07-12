# agentContent 스키마 수집 (팩 작성용)

> ⚠️ **정본은 코드다**(DECISIONS.md ADR-7). 이 문서는 각 에이전트 파일 상단 `CONTENT_DEFAULTS`의 스냅샷이다.
> 어긋나면 `CONTENT_DEFAULTS`(및 실제 소비 지점)를 신뢰하고 이 문서를 즉시 갱신하라. 추측으로 키를 쓰지 말고 해당 파일을 먼저 읽어라.

공통 규칙: 각 키는 통째 교체 계약. shape·항목 수 유지. 도메인 팩 파일의 `agentContent: { "<agent-id>": {...} }`에 기입.

## agent-translate (TranslateAgent.jsx)
- sourceText: string — 샘플 원문, '\n\n' 구분 문단 3개 (좌측 패널·역번역 대조·srcText 초기값)
- translatedText: string — 번역 결과, '\n\n' 구분 문단 3개 (sourceText와 문단 수 일치 권장)
- chunks: {id:number,text:string}[5] — 청킹 결과(원문 의미 단위 분할)
- summaryKo: string / summaryEn: string — 요약 패널 좌/우
- backTranslated: string — 역번역 검증 텍스트, 첫 문단만 노출
- glossary: {ko,en,category}[8] — 도메인 용어집

## agent-review (DocReviewAgent.jsx)
- apvLine: {name,dept,title,role}[3] — 결재선(작성자→검토자→승인자 순서 고정)
- ragDocs: string[7] — RAG 검색 티커 규정 조항명
- violations: {clause,type,severity:'high'|'medium'|'low',content,action}[3] — 심각도별 1건씩, highlightSegs와 대응 (준수율 자동 산출)
- regs: {id:'r1'~'r5',label}[5] — 검토 대상 규정 선택지. id는 r1~r5 유지
- highlightSegs: {text,type:null|'high'|'medium'|'low'}[7] — 문서 본문 분절, type이 violations severity와 대응
- highlightLegendLabels: {high,medium,low} — 범례 문구 3종
- highlightDocTitle / reviewNum / dept / docNum / apvDocNum: string
- logoSrc: string(data URI) / logoAlt: string

## agent-safety (SafetyPlanAgent.jsx)
- agents: {icon:LucideIcon,label,sub,color,ms}[4] — 시뮬레이션 단계
- riskOptions: string[10] — 위험 요인 선택지 (riskData 키와 일치 필수)
- riskData: {[riskOption]:{level,freq,sev:1~5,lkl:1~5,lvlColor,measure}}
- resultText: string — 계획서 전문
- apvLine: {name,dept,title,role}[3]
- defaultProjName / defaultProjType / defaultProjLoc / defaultDuration: string — 폼 초기값 4종
- defaultRisks: string[3] — 초기 선택 (riskOptions 부분집합)
- projTypePlaceholder / uploadHint: string
- ragDocs: {name,hits:number}[5] / ragTags: string[6]
- checklist: string[7] / laws: string[5]
- orgLeader / orgManager: string / orgMembers: string[2]
- emergencySteps: {label,sub,color:tailwind bg클래스}[4]
- planSections: {sub,items:string[3]}[3]
- dept / docNum / brandLine / logoSrc / logoAlt / apvRef / periodRange: string

## agent-dataanalysis (DataAnalysisAgent.jsx) — 메인 세션 작성
- sampleFiles: {id,name,rows,cols,size}[3]
- trendCaption: string / trendData: {month,...seriesKey}[9] / trendSeries: {key,color}[3] / trendDomain:[lo,hi] / trendRef:number|null / trendRefLabel
- barTabLabel / barCaption / barData / barXKey / barValueKey / barUnit
- stackTabLabel / stackCaption / stackData: {month,...}[3] / stackSeries: {key,color}[3]
- statsTable: {metric,value,change,status:'normal'|'high'|'warning'}[6]
- outlierSummary / docStandard / docStandardNote: string

## 코어 승격 필드 (agentContent 외 — 팩 최상위)
- secureSuggestions: SECURE_SUGGESTIONS shape [4] (icon,iconBg,iconColor,title,query) — 선택
- modeAnswers: { REVIEW, TRANSLATE, REPORT, SECURE_DEFAULT, SECURE_AIRGAP } — 각각 {content,citations:[],steps} answer 객체, REPORT는 document 필드 가능 — 선택
- fileData: FILE_DATA shape { d1:{title,date,secLevel,text,highlights[]} ... } — 선택 (docs의 id와 일치)
- generateDocHTML(doc, org): org = {name, short, color, en} 자동 주입됨 (UserApp) — 팩 작업 불필요. doc.sealText로 직인 문구 교체 가능

## agent-dbquery (DBQueryAgent.jsx)
- headerTitle / headerSubtitle / dbStatusLabel / emptyTitle: string
- dbSources: {key,label,desc}[3] — key 'building'|'land'|'lup' 고정
- permissionLevels: {id,label,desc,badge}[3] — id 'general'|'manager'|'evaluator' 고정
- permissionNotices: {general,manager,evaluator}
- queryHistory: {id,query,date,rows,ms}[4] / quickQueries: string[4]
- buildingRows[8] (status '위반'=붉은 배지) / landRows[5] (ownership '법인'=파란 배지, landPrice는 general 권한 가림) / lupRows[5]
- sqlMap: {building,land,lup} — SQL 문자열
- statsBySource: {building|land|lup: {label,value,icon:'table'|'filter'|'trend'|'clock'|'shield',color}[4]}
- buildingColumns: {key,label}[8] (key=행 필드명, 정렬 연동) / landColumns: string[7] / lupColumns: string[5]
- restrictedNotice: string

## agent-address (AddressAgent.jsx)
- defaultAddress / addressPlaceholder / quickExamples: string[3]
- defaultAptQuery / aptPlaceholder / aptQuickExamples: string[3]
- aptLookupResult: {query,complexName,complexCode,address,roadAddress,legalDong,legalCode,totalHouseholds,totalBuildings,buildings[4],units[6]}
- singleResult: {road,jibun,zip,lat,lng,buildType,adminDong,legalDong,legalCode,adminCode,status('완전매칭'|'부분매칭'),complexName,complexCode} — buildType '공동주택'일 때 코드 섹션 노출
- sampleBatch: string(개행 5줄) / batchResults[5]
- modeTypes: {m,icon,label,desc,color}[4] — m 'single'|'batch'|'ocr'|'reverse', color 'rose'|'orange'|'teal'|'purple' 고정
- ocrDocText: string / ocrAddrResults[5] / ocrFeatureLabel: string
- codeLookup: {코드10자리:{type,dong,road,jibun,zip,legalCode,adminCode,...,region}} / codeQuickExamples: {code,label}[3]

## agent-summary (SummaryAgent.jsx)
- docAName / docBName / resultDocLabel / resultCompareLabel: string
- structureHints: string[4] / summaryStats: {label,val}[4] / compareStats: {label,val}[4]
- compareRows: {category,docA,docB,diff}[8] — diff '동일'=회색
- docALabel / docBLabel / compareFootnote: string
- tableSummaryRows: {ch,content,key}[5] / keywords: {word,pct}[12]
- sections: {id,title,children:string[]}[5]
- summaryContent: string — `**헤더**\n본문` 블록을 \n\n 구분

## agent-meeting (MeetingMinutesAgent.jsx)
- defaultTitle / defaultDate(YYYY-MM-DD) / defaultPlace: string
- defaultAttendees: {name,dept,role}[4] / defaultAgenda: string[2]
- sttSampleText: string — 공백 구분 STT 스트리밍
- diarization: {time,speaker,color,bg,border,text,docKey,meetingText}[8] — docKey는 docSections.key와 일치
- docSections: {key,num,label,brief,color}[7] / speakerLegend: {name,color,bg,border}[4]
- actions: {label,person,dept,due}[4] / deptName / docNum: string
- openingLines: string[2] / agendaDiscussions: {lines:string[],conclusion}[2] / decisions: string[3] / specialNotes: string[2]
- footerText / logo(data URI) / logoAlt / resultText / apvLine[3]

## agent-ocr (OCRAgent.jsx)
- sampleFiles: {name,size,pages,type:'pdf'|'img'}[2]
- docModeOptions: {value:'standard'|'compensation'(고정),label,desc}[2]
- specialModeKeyword / specialModeDesc / specialModeBadge: string
- extractedText / maskedText: string(멀티라인, 서로 대응)
- maskLog: {type,original,masked,pos}[4]
- tableData: {headers:string[6], rows:string[6][5]} / tableCaption: string
- confidenceMap: {line,score,level:'high'|'med'|'low'}[10]

## agent-knowledge (KnowledgeAgent.jsx)
- defaultQuery: string (aiSummaries 키와 일치 권장) / quickQueries: string[4]
- knowledgeBases: {id,name,docs,updated,icon(lucide),color}[7] / defaultSelectedKbIds: string[3]
- recentSearches: {id,query,date,results}[3]
- results: {id,title,source,page,score,secLevel,line,excerpt,keywords[]}[5] — score 내림차순
- aiSummaries: {[질의문]:요약문, DEFAULT:폴백} / similarDocs: {title,source,relevance}[3]

## agent-internalreg (InternalRegAgent.jsx)
- regCategories: string[8] / defaultCategories: string[2] / suggestions: string[5]
- ragDocs: {name,hits}[5] / apvLine: {role,name,dept,title}[3]
- answerText: string(멀티라인) / citations: {doc,title,excerpt}[3] / relatedRegs: {title,desc}[3]
- regHistory: {reg,changes:{ver,date,type,badge,content,reason}[]}[3]
- emptyDesc: string[2] / inputPlaceholder / regSystemFooter / apvDocTitle / apvDocNum: string

## agent-chatbot (ChatbotAgent.jsx)
- welcomeText: string(마크다운) / welcomeSources: string[] (sourcePreviews 키와 일치 시 미리보기)
- sourcePreviews: {[출처명]:{title,type:'PDF'|'LAW'|'HWP',pages?,page?,section?,article?,excerpt:{text,hl}[]}}
- faqItems: {id,q,category,a,sources[]}[6] — category는 faqCategories와 일치
- faqCategories: string[5] ('전체'는 코어 자동 추가) / faqCategoryColors: {[category]:배지클래스}
- delegateRules: {keywords[],agentId,agentName,reason}[6]
- correctionExample: string / suggestQuestions: string[3] (faqItems.q와 일치 시 FAQ 매칭)
- fallbackAnswerBody: string / fallbackSources: string[2]
- headerSubtitle / inputPlaceholder: string / quickAgents: {label,id,color}[3]

## agent-report (ReportAgent.jsx)
- apvLine: {name,dept,title,role}[3] — [0]이 작성자
- reportTypes: {id,label,icon(이모지),desc}[5] — 첫 항목 초기 선택
- docNums: {[typeId]:문서번호} / docNumFallback: string
- reportDefaults: {[typeId]:{dept,period,mainWork,nextPlan,special}}
- reportDate / pressDate / pressDistDate / approvalSystem / apvRefNo: string
- logo: dataURI / logoAlt: string
- perfCharts: {[typeId]:{label,data[3]}} / perfDoneKey / perfGoalKey
- pressTypeId: string — 보도자료 레이아웃 사용 유형 id
- pressKpiTitle / pressKpiCards[4] / pressKpiStats[3]
- pressTrendTitle / pressTrendData[3] / pressTrendSeries[3] / pressTrendDomain
- pressBarTitle / pressBarData[5] / pressBarSeries: {key,color,posColor}[3]
- pressSections: {num,title,regions[3],details[3]}[3]
- pressIndexTitle / pressIndexHead[5] / pressIndexGroups: {label,rows[3]}[3] / pressIndexNote
- pressRatio*: 이중축 차트 세트(LeftKey/RightKey/Domain/Threshold/RefLabel/Note) / pressContact
- buildPressHtml / buildReportHtml: 함수 통째 교체 계약

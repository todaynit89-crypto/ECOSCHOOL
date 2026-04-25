import React, { useState, useRef, useEffect } from 'react';
import { Leaf, Zap, Recycle, Utensils, Car, Monitor, Cloud, Presentation, Loader2, CheckCircle2, Sun, TreePine, Snowflake, Globe2, Coins, ArrowRight, Wind, Calendar, Sprout, Droplets, Smartphone, ShoppingBag, ArrowDown, AlertCircle, Download, Award, Share2, Printer, Thermometer, Info, X, Shirt, Carrot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

type SchoolLevel = '초등학교' | '중학교' | '고등학교';
type Category = 'energy' | 'temperature' | 'resource' | 'meals' | 'transport' | 'water' | 'digital' | 'consumption' | 'clothing' | 'vegetarian' | 'planting' | 'recycling' | 'custom';
type Theme = 'chalkboard' | 'sky' | 'forest';

interface GeneratedResult {
  message: string;
  effect: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  visualTheme: 'tree' | 'ice' | 'earth' | 'money';
  carbonReduction: number;
  yearlyCarbonReduction: number;
  treesPlanted: number;
  actionItems: string[];
}

export default function App() {
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('중학교');
  const [category, setCategory] = useState<Category>('energy');
  const [theme, setTheme] = useState<Theme>('chalkboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPledged, setIsPledged] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null); // For image export

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  const [inputs, setInputs] = useState({
    userName: '', // Add userName
    energyCurrent: '',
    energyReduction: '',
    energyTempCurrent: '',
    energyTempTarget: '',
    resourceCurrent: '',
    resourceReduction: '',
    mealsCurrent: '',
    mealsReduction: '',
    transportCurrent: '',
    transportReduction: '',
    waterCurrent: '',
    waterReduction: '',
    digitalCurrent: '',
    digitalReduction: '',
    consumptionCurrent: '',
    consumptionReduction: '',
    clothingCurrent: '',
    clothingReduction: '',
    vegetarianCurrent: '',
    vegetarianReduction: '',
    plantingCurrent: '',
    plantingReduction: '',
    recyclingCurrent: '',
    recyclingReduction: '',
    customName: '',
    customUnit: '',
    customCurrent: '',
    customReduction: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const fillSampleData = () => {
    setInputs({
      userName: '3학년 1반 OOO',
      energyCurrent: '400',
      energyReduction: '40',
      energyTempCurrent: '24',
      energyTempTarget: '22',
      resourceCurrent: '50',
      resourceReduction: '10',
      mealsCurrent: '100',
      mealsReduction: '50',
      transportCurrent: '5',
      transportReduction: '2',
      waterCurrent: '2',
      waterReduction: '0.5',
      digitalCurrent: '100',
      digitalReduction: '50',
      consumptionCurrent: '5',
      consumptionReduction: '2',
      clothingCurrent: '10',
      clothingReduction: '3',
      vegetarianCurrent: '30',
      vegetarianReduction: '10',
      plantingCurrent: '10',
      plantingReduction: '5',
      recyclingCurrent: '20',
      recyclingReduction: '10',
      customName: '플라스틱 컵',
      customUnit: '개',
      customCurrent: '10',
      customReduction: '5',
    });
  };

  const generateLocalResult = (
    schoolLevel: string,
    category: string,
    baseValue: number,
    reductionTarget: number,
    unit: string,
    categoryName: string
  ): GeneratedResult => {
    let carbonPerUnit = 1;
    let yearlyMultiplier = 365;
    let visualTheme: 'tree' | 'ice' | 'earth' | 'money' = 'tree';
    let message = '';
    let effect = '';
    let actionItems: string[] = [];

    const isElem = schoolLevel === '초등학교';
    const isMid = schoolLevel === '중학교';
    const isHigh = schoolLevel === '고등학교';

    switch (category) {
      case 'energy':
        carbonPerUnit = 0.4781;
        yearlyMultiplier = 12; // 월간 -> 연간
        visualTheme = 'money';
        message = isElem ? '전기 절약으로 지구를 시원하게! ⚡' : isMid ? '에너지 절약, 우리 반부터 시작! ⚡' : '에너지 절약 실천, 지구를 위한 기본입니다 ⚡';
        effect = isElem ? '빈 교실의 불을 끄고 전기를 아끼면 북극곰의 집을 지켜줄 수 있어요.' : isMid ? '우리 반의 전력 사용량을 줄여 온실가스 배출을 크게 감소시켰습니다.' : '불필요한 전력 소모를 줄여 국가 에너지망 부하를 낮추고 탄소 배출을 억제합니다.';
        actionItems = isElem ? ['교실 나갈 때 불 끄기', '컴퓨터 콘센트 빼기', '햇빛으로 교실 밝히기'] : isMid ? ['빈 교실 불 끄기', '사용하지 않는 플러그 뽑기', '자연 채광 활용하기'] : ['이동 수업 시 부분 소등하기', '대기전력 차단 멀티탭 사용하기', '낮 시간 창측 조명 소등하기'];
        break;
      case 'temperature':
        carbonPerUnit = 0.5; // 학급당 1도 조절 시 하루 약 0.5kg 절감 추정
        yearlyMultiplier = 100; // 냉난방 가동일 약 100일
        visualTheme = 'ice';
        message = isElem ? '적정 온도 유지로 펭귄을 살려요! 🐧' : isMid ? '적정 온도 맞추기, 센스 있는 우리 반! 🌡️' : '실내 적정 온도 유지로 기후위기 대응 🌡️';
        effect = isElem ? '냉난방 온도를 조금만 양보하면 북극의 얼음이 녹는 걸 막을 수 있어요.' : isMid ? '냉난방기 온도를 조절해 에너지를 절약하고 온실가스 배출을 줄입니다.' : '과도한 냉난방기 사용을 줄임으로써 에너지 낭비를 막고 화석연료 연소를 최소화합니다.';
        actionItems = isElem ? ['여름엔 시원한 옷차림', '겨울엔 내복 입기', '에어컨 켤 때 창문 닫기'] : isMid ? ['여름철 26도, 겨울철 20도 유지하기', '냉난방기 가동 시 창문 닫기', '계절에 맞는 옷차림 하기'] : ['계절별 법정 권장온도 준수하기', '주기적인 쾌적도 점검 및 환기', '교복 동복/하복 유연하게 착용하기'];
        break;
      case 'resource':
        carbonPerUnit = 0.00525;
        yearlyMultiplier = 12; // 월간 -> 연간
        visualTheme = 'tree';
        message = isElem ? '종이 아껴서 나무를 보호해요! 🌳' : isMid ? '종이 낭비 줄이고 숲을 만들자! 🌲' : '자원 순환 시스템 구축, 페이퍼리스 실천 🌲';
        effect = isElem ? '우리가 쓰는 종이를 줄이면 숲 속 작은 동물들의 집을 지킬 수 있어요.' : isMid ? '나의 종이 사용을 줄여 나무가 베어지는 것을 막고 숲을 보존합니다.' : 'A4 용지 등 일회성 자재 소모를 줄여 목재 생산으로 인한 산림 파괴를 방지합니다.';
        actionItems = isElem ? ['이면지 모아서 그림 그리기', '알림장은 스마트폰으로 확인하기', '딱 필요한 인쇄만 양면으로!'] : isMid ? ['이면지 활용하기', '태블릿/노트북으로 디지털 필기하기', '꼭 필요한 인쇄만 양면으로 하기'] : ['학습 자료 디지털 배포 및 제출 활용', '이면지 수거함 체계적 관리', '부서/동아리별 인쇄 쿼터제 도입'];
        break;
      case 'meals':
        carbonPerUnit = 0.00165; // 1.65 kgCO2/kg -> 0.00165 kgCO2/g
        yearlyMultiplier = 200; // 급식일 약 200일
        visualTheme = 'earth';
        message = isElem ? '잔반 없는 날, 지구가 웃는 날! 😋' : isMid ? '다 먹으면 영양도 챙기고 지구도 살리고! 🍽️' : '푸드 마일리지 감소와 음식물 쓰레기 제로 🍽️';
        effect = isElem ? '내가 남기지 않은 음식물 덕분에 나쁜 냄새와 가스가 생기지 않아요.' : isMid ? '잔반을 남기지 않아 음식물 쓰레기 처리 시 발생하는 메탄가스를 막아줍니다.' : '음식물 폐기물 처리 과정의 에너지를 절감하고 매립 가스 배출을 차단합니다.';
        actionItems = isElem ? ['먹을 수 있는 만큼만 받기', '편식하지 않고 골고루 먹기', '급식 다 먹고 스티커 받기'] : isMid ? ['먹을 만큼만 배식받기', '급식 챌린지 적극 참여하기', '잔반 없는 날 이벤트 열기'] : ['자율 배식대 적정량 활용', '식단 선호도 조사로 잔반 원천 차단', '음식물 폐기 계량 시스템 도입 참여'];
        break;
      case 'transport':
        carbonPerUnit = 1.05; // 왕복 5km 기준 (5 * 0.21)
        yearlyMultiplier = 200; // 등교일 약 200일
        visualTheme = 'earth';
        message = isElem ? '씩씩하게 걸어서 학교 가요! 🚶‍♂️' : isMid ? '스쿨버스랑 도보로 등교하는 힙한 일상! 🚲' : '친환경 모빌리티 및 대중교통 이용 활성화 🚌';
        effect = isElem ? '부모님 차 대신 직접 걸어가면 공기가 아주 깨끗해져요.' : isMid ? '승용차 대신 도보나 대중교통을 이용해 미세먼지와 대기 오염을 막습니다.' : '내연기관 차량 탑승을 지양함으로써 미세먼지 원인 물질과 온실가스를 감축합니다.';
        actionItems = isElem ? ['친구들과 걸어서 등교하기', '자전거로 안전하게 다니기', '비 오는 날만 차 타기'] : isMid ? ['가까운 거리는 걷거나 자전거 타기', '등하교 시 대중교통 이용하기', '부모님께 친환경 운전 권유하기'] : ['친환경 대중교통 노선 숙지 및 활용', '교내 자전거 거치대 활용', '근거리 통학 보행 환경 개선 캠페인'];
        break;
      case 'water':
        carbonPerUnit = 0.332;
        yearlyMultiplier = 12; // 월간 -> 연간
        visualTheme = 'ice';
        message = isElem ? '물 한 방울도 보석처럼 아껴요! 💧' : isMid ? '물 절약, 작은 습관이 만드는 큰 변화! 💧' : '수자원 보존 및 정수 에너지 감축 💧';
        effect = isElem ? '양치할 때 물을 잠그면 깨끗한 물을 낭비하지 않고 지킬 수 있어요.' : isMid ? '나의 물 절약이 수자원을 보호하고 수돗물을 만드는 데 드는 전기를 아낍니다.' : '정수 및 하수 처리 시설 작동에 소요되는 전력 낭비를 방지하여 환경 유해성을 낮춥니다.';
        actionItems = isElem ? ['양치할 때 꼭 양치컵 쓰기', '비누칠 할 때는 물 잠그기', '손 씻을 때 물 살짝만 틀기'] : isMid ? ['양치컵 사용 생활화', '샤워 시간 5분 줄이기', '학교 식수대 물 낭비하지 않기'] : ['화장실 절수형 기기 교체 건의', '실험/실습 시 물 사용량 최소화', '생활하수 저감 실천'];
        break;
      case 'digital':
        carbonPerUnit = 0.004;
        yearlyMultiplier = 1; // 누적 데이터 삭제는 1회성
        visualTheme = 'tree';
        message = isElem ? '인터넷 쓰레기통도 비워주세요! 📱' : isMid ? '디지털 다이어트로 폰도 가볍게, 지구도 가볍게! 📧' : '데이터 저장소 최적화로 디지털 탄소발자국 감축 💻';
        effect = isElem ? '안 보는 메일과 사진을 지우면 컴퓨터 마을의 전기를 아낄 수 있대요.' : isMid ? '메일함의 불필요한 데이터를 지워 거대한 데이터센터의 전력 사용을 줄입니다.' : '스팸 데이터 보관에 지속 소모되는 데이터센터 클라우드 서버의 탄소 배출을 억제합니다.';
        actionItems = isElem ? ['안 하는 게임 지우기', '사진첩 정리하기', '이메일 휴지통 비우기'] : isMid ? ['스팸 메일 차단 및 불필요한 메일 삭제', '동영상 스트리밍 해상도 조절', '카톡 휴지통 주기적으로 비우기'] : ['클라우드 불필요한 백업 파일 삭제', '스크린 타임 줄이기 캠페인', '스트리밍 대신 다운로드 후 시청'];
        break;
      case 'consumption':
        carbonPerUnit = 0.086; // 2.15 kgCO2/kg * 0.04 kg/item
        yearlyMultiplier = 40; // 학사일정 약 40주
        visualTheme = 'earth';
        message = isElem ? '내 전용 물컵을 사용해요! 🥤' : isMid ? '일회용품 플라스틱 NO, 내 텀블러 YES! 🥤' : '일회용품 제로화 및 다회용품 공유 체계 ♻️';
        effect = isElem ? '일회용 플라스틱을 안 쓰면 바닷속 거북이와 고래가 아프지 않아요.' : isMid ? '다회용품 사용 습관이 플라스틱 쓰레기를 줄이고 해양 생태계를 보호합니다.' : '무분별한 플라스틱 소모를 차단하고 석유화학 공정에서 발생하는 탄소를 저감합니다.';
        actionItems = isElem ? ['내 텀블러(물통) 들고 다니기', '플라스틱 빨대 안 쓰기', '물건 소중하게 오래 쓰기'] : isMid ? ['개인 텀블러 사용하기', '분리수거 철저히 하기', '학교 매점갈 때 장바구니 챙기기'] : ['교내 텀블러 세척기 도입 건의', '친환경 생분해 제품 우선 소비', '제로웨이스트 소비문화 확산'];
        break;
      case 'clothing':
        carbonPerUnit = 15; // 1벌 당 약 15 kgCO2e
        yearlyMultiplier = 1; // 1회성
        visualTheme = 'earth';
        message = isElem ? '작아진 옷은 깨끗하게 물려줘요! 👕' : isMid ? '패스트 패션 탈출! 교복 물려 입기 👗' : '의류 리사이클링 및 제로웨이스트 패션 실천 👔';
        effect = isElem ? '새 옷을 만드는 데 드는 많은 에너지와 물을 아껴서 환경을 살려요.' : isMid ? '버려지는 옷을 줄이고 교복을 재사용하면 새 옷을 만들 때 나오는 탄소를 막아요.' : '의류 생산 공정의 환경 오염을 피하고 폐섬유 소각으로 인한 유독 물질 발생을 억제합니다.';
        actionItems = isElem ? ['형, 누나 옷 예쁘게 물려입기', '동생에게 작아진 옷 주기', '옷 깨끗하게 입기'] : isMid ? ['졸업생 교복 물려받기/주기', '유행타는 옷 충동 구매 피하기', '옷 수선해서 오래 입기'] : ['교내 교복 나눔 장터 자체 기획', '빈티지/세컨핸드 의류 활용', '친환경 소재 의류 브랜드 선호'];
        break;
      case 'vegetarian':
        carbonPerUnit = 1.5; // 고기 없는 한 끼당 약 1.5 kgCO2e 감축
        yearlyMultiplier = 40; // 주 1회 실천 시 (연 약 40주)
        visualTheme = 'earth';
        message = isElem ? '고기 없는 식단도 맛있는 마법! 🥕' : isMid ? '지구를 위한 지구인 식단, 채식 DAY! 🥗' : '저탄소 식단 전환을 통한 가축 메탄가스 감축 🥦';
        effect = isElem ? '방귀 뀌는 소를 조금 덜 키워도 되어서 지구가 뜨거워지는 걸 막아줘요.' : isMid ? '육류 소비를 줄이면 소나 돼지를 기르며 생기는 거대한 양의 온실가스를 직접 줄일 수 있어요.' : '축산업에서 다량 배출되는 메탄과 사료 운송에 소모되는 화석연료 연소를 근본적으로 감소시킵니다.';
        actionItems = isElem ? ['채소 반찬 남기지 않고 먹어보기', '일주일에 한 번 고기 대신 두부 먹기', '농부 아저씨께 감사하며 먹기'] : isMid ? ['학교 채식급식의 날 적극 참여하기', '채소 위주의 샌드위치 먹어보기', '대체육(콩고기 등) 거부감 줄이기'] : ['주 1회 비건(Vegan) 라이프 실천', '육류 생산의 탄소발자국 지표 탐구', '로컬푸드 위주 저탄소 식단 구성'];
        break;
      case 'planting':
        carbonPerUnit = 2.5; // 작은 화분 1개당 연간 약 2.5 kgCO2e 흡수
        yearlyMultiplier = 1; // 연간 흡수량 기준
        visualTheme = 'tree';
        message = isElem ? '우리 반 교실에 초록 친구가 생겼어요! 🪴' : isMid ? '교실 속 작은 숲, 1인 1반려식물 🌿' : '교내 생태 공간 및 탄소 흡수원 확보 🌳';
        effect = isElem ? '작은 화분 하나가 나쁜 공기를 먹고 맑은 공기를 내뿜어서 교실이 상쾌해져요.' : isMid ? '교실에 둔 실내 식물은 공기를 정화하고 탄소를 직접 흡수하는 훌륭한 산소 공장입니다.' : '단순한 온실가스 감축을 넘어 적극적인 탄소 흡수원 확보를 통해 진정한 탄소중립에 기여합니다.';
        actionItems = isElem ? ['1인 1화분 소중히 가꾸기', '생수병, 우유팩으로 화분 만들기', '식물에게 예쁜 말 해주기'] : isMid ? ['학급 정원(플랜테리어) 만들기', '버려지는 용기로 업사이클링 화분 제작', '점심시간에 학교 화단 산책하기'] : ['교내 자투리 공간 및 옥상 녹화 캠페인', '공기정화식물 생육 및 탄소흡수량 데이터 추적', '지역사회 나무심기 봉사활동 연계'];
        break;
      case 'recycling':
        carbonPerUnit = 1.5; // 고품질 재활용(투명 페트병 등) 1kg당 약 1.5 kgCO2e 감축
        yearlyMultiplier = 40; // 주 단위 누적 시 (연 40주 학사일정)
        visualTheme = 'earth';
        message = isElem ? '딱지 떼고, 씻고, 착착! 분리수거 대장 🦸‍♂️' : isMid ? '라벨 떼고 찌그러뜨리기, 분리배출의 정석! ♻️' : '자원 순환율 100% 도전, 고도화된 분리수거 🔄';
        effect = isElem ? '깨끗하게 모은 쓰레기들은 불에 타지 않고 예쁜 필통이나 가방으로 다시 태어나요.' : isMid ? '제대로 분리 배출된 자원은 소각장을 거치지 않아 유해 가스와 탄소 발생을 막아줍니다.' : '혼합 배출로 인한 폐기물 소각을 방지하여 매립장 수명을 늘리고 탄소 발생을 최소화합니다.';
        actionItems = isElem ? ['음료수 다 먹고 물로 씻어서 버리기', '상자 테이프 떼고 버리기', '딱지 접지 않고 쫙 펴서 버리기'] : isMid ? ['투명 페트병 라벨 제거 및 분리수거', '이면지와 일반 쓰레기 철저히 구분', '재질이 섞인 쓰레기는 종량제 봉투에 버리기'] : ['플라스틱 세부 재질별 분리(PET, PP, PS) 캠페인', '종이팩/멸균팩 전용 수거함 마련 및 거점 수거', '교내 플로깅 및 자원순환 자치 동아리 활동'];
        break;
      case 'custom':
      default:
        carbonPerUnit = 1.0;
        yearlyMultiplier = 200;
        visualTheme = 'tree';
        message = isElem ? `${categoryName} 줄이기로 지구 지키기! 🌟` : isMid ? `${categoryName} 실천으로 앞서가는 에코스쿨! 🌟` : `${categoryName} 목표 달성으로 탄소중립 실천 🌟`;
        effect = isElem ? '일상 속 작은 실천들이 모여서 크고 건강한 숲을 만들 수 있어요.' : isMid ? '우리 반의 작은 실천으로 탄소 배출을 직접 줄이고 환경을 힙하게 보호합니다.' : '설정된 감축 행동을 정량적으로 달성하여 실질적인 기후위기 완화에 기여합니다.';
        actionItems = isElem ? ['친구들과 실천 약속하기', '가족들에게 자랑하기', '매일매일 잊지 않기'] : isMid ? ['꾸준히 실천 인증하기', 'SNS에 에코 챌린지 공유하기', '새로운 목표 세우기'] : ['감축 성과 정량적 모니터링', '학내 캠페인 부스 운영', '지역사회 환경 활동과 연계'];
        break;
    }

    const carbonReduction = reductionTarget * carbonPerUnit;
    const yearlyCarbonReduction = carbonReduction * yearlyMultiplier;
    const treesPlanted = yearlyCarbonReduction / 6.6;

    return {
      message,
      effect,
      currentValue: baseValue,
      targetValue: category === 'planting' ? baseValue + reductionTarget : baseValue - reductionTarget,
      unit,
      visualTheme,
      carbonReduction: Number(carbonReduction.toFixed(2)),
      yearlyCarbonReduction: Number(yearlyCarbonReduction.toFixed(2)),
      treesPlanted: Number(treesPlanted.toFixed(1)),
      actionItems,
    };
  };

  const handlePledge = () => {
    setIsPledged(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#10B981', '#3B82F6', '#F59E0B'],
      zIndex: 1000
    });
    
    // Scroll the capture area into view so mobile users can see the stamp
    if (captureRef.current) {
      setTimeout(() => {
        captureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleGenerate = async () => {
    setIsPledged(false);
    setLoading(true);
    setError(null);
    try {
      let inputDataStr = '';
      let categoryName = '';
      let baseValue = 0;
      let reductionTarget = 0;
      let unit = '';
      
      if (category === 'energy') {
        categoryName = '에너지 (전력)';
        baseValue = Number(inputs.energyCurrent) || 100;
        reductionTarget = Number(inputs.energyReduction) || 0;
        unit = 'kWh';
      } else if (category === 'temperature') {
        categoryName = '실내 온도 조절';
        baseValue = Number(inputs.energyTempCurrent) || 24;
        reductionTarget = (Number(inputs.energyTempCurrent) - Number(inputs.energyTempTarget)) || 0;
        unit = '℃';
        inputDataStr = `현재 실내온도: ${inputs.energyTempCurrent}℃, 목표 실내온도: ${inputs.energyTempTarget}℃`;
      } else if (category === 'resource') {
        categoryName = '자원순환 (종이)';
        baseValue = Number(inputs.resourceCurrent) || 100;
        reductionTarget = Number(inputs.resourceReduction) || 0;
        unit = '장';
      } else if (category === 'meals') {
        categoryName = '녹색급식 (잔반)';
        baseValue = Number(inputs.mealsCurrent) || 100;
        reductionTarget = Number(inputs.mealsReduction) || 0;
        unit = 'g';
      } else if (category === 'transport') {
        categoryName = '생활/수송 (차량 등교)';
        baseValue = Number(inputs.transportCurrent) || 100;
        reductionTarget = Number(inputs.transportReduction) || 0;
        unit = '명';
      } else if (category === 'water') {
        categoryName = '수자원 (수도)';
        baseValue = Number(inputs.waterCurrent) || 100;
        reductionTarget = Number(inputs.waterReduction) || 0;
        unit = '톤';
      } else if (category === 'digital') {
        categoryName = '디지털 탄소발자국 (이메일)';
        baseValue = Number(inputs.digitalCurrent) || 1000;
        reductionTarget = Number(inputs.digitalReduction) || 0;
        unit = '건';
      } else if (category === 'consumption') {
        categoryName = '친환경 소비 (일회용품)';
        baseValue = Number(inputs.consumptionCurrent) || 500;
        reductionTarget = Number(inputs.consumptionReduction) || 0;
        unit = '개';
      } else if (category === 'clothing') {
        categoryName = '자원순환 (교복/의류)';
        baseValue = Number(inputs.clothingCurrent) || 100;
        reductionTarget = Number(inputs.clothingReduction) || 0;
        unit = '벌';
      } else if (category === 'vegetarian') {
        categoryName = '녹색급식 (저탄소 채식)';
        baseValue = Number(inputs.vegetarianCurrent) || 100;
        reductionTarget = Number(inputs.vegetarianReduction) || 0;
        unit = '명';
      } else if (category === 'planting') {
        categoryName = '탄소 흡수원 (학교 숲/화분)';
        baseValue = Number(inputs.plantingCurrent) || 10;
        reductionTarget = Number(inputs.plantingReduction) || 0;
        unit = '화분(그루)';
      } else if (category === 'recycling') {
        categoryName = '자원순환 (올바른 분리배출)';
        baseValue = Number(inputs.recyclingCurrent) || 50;
        reductionTarget = Number(inputs.recyclingReduction) || 0;
        unit = 'kg';
      } else if (category === 'custom') {
        categoryName = inputs.customName || '사용자 지정 데이터';
        baseValue = Number(inputs.customCurrent) || 100;
        reductionTarget = Number(inputs.customReduction) || 0;
        unit = inputs.customUnit || '단위';
      }

      // Simulate a small delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const parsed = generateLocalResult(schoolLevel, category, baseValue, reductionTarget, unit, categoryName);
      setResult(parsed);
      
      // Trigger confetti on success
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#eab308', '#ec4899']
        });
      }, 300);

    } catch (err) {
      console.error("Error generating content:", err);
      setError("행동 지침 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const getThemeIcon = (visualTheme: string) => {
    switch (visualTheme) {
      case 'tree': return <TreePine className="w-10 h-10 text-green-500" />;
      case 'ice': return <Snowflake className="w-10 h-10 text-blue-400" />;
      case 'earth': return <Globe2 className="w-10 h-10 text-teal-500" />;
      case 'money': return <Coins className="w-10 h-10 text-yellow-500" />;
      default: return <Leaf className="w-10 h-10 text-green-500" />;
    }
  };

  // Calculate percentage for the bar chart
  const getChartPercentage = (current: number, target: number) => {
    if (current === 0) return 0;
    const isReduction = target < current;
    if (isReduction) {
      return (target / current) * 100;
    } else {
      return (current / target) * 100;
    }
  };

  // Gamification: Get Badge based on trees planted
  const getBadge = (trees: number) => {
    if (trees >= 100) return { title: '기후 영웅 🦸‍♂️', color: 'from-yellow-400 to-orange-500', desc: '엄청난 양의 탄소를 줄였어요!' };
    if (trees >= 50) return { title: '지구 수호대 🌍', color: 'from-blue-400 to-indigo-500', desc: '지구를 살리는 훌륭한 실천이에요!' };
    if (trees >= 10) return { title: '숲의 요정 🌳', color: 'from-green-400 to-emerald-500', desc: '작은 숲을 만들어가고 있어요!' };
    return { title: '새싹 지킴이 🌱', color: 'from-lime-400 to-green-500', desc: '환경 보호의 첫걸음을 내디뎠어요!' };
  };

  // Export: Download as Image
  const handleDownload = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: theme === 'chalkboard' ? '#2A3B2C' : '#E0F2FE'
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ecoschool-dashboard-${Date.now()}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Left Panel */}
      <div className="w-full md:w-[350px] lg:w-[400px] bg-white border-r border-gray-200 p-4 flex flex-col md:h-screen overflow-y-auto shadow-xl z-10 shrink-0 print:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-lg">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">에코스쿨 대시보드</h1>
              <p className="text-xs text-gray-500 font-medium leading-tight">탄소중립 행동 지침 생성기</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowInfoModal(true)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="계산 기준 보기"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {/* School Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span className="bg-gray-100 text-gray-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">1</span>
              학교급 선택
            </label>
            <div className="flex gap-1.5">
              {['초등학교', '중학교', '고등학교'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSchoolLevel(level as SchoolLevel)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    schoolLevel === level
                      ? 'bg-green-50 text-green-700 border-2 border-green-500 shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span className="bg-gray-100 text-gray-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">2</span>
              데이터 카테고리
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl">
              <TabButton active={category === 'energy'} onClick={() => setCategory('energy')} icon={<Zap size={14} />} label="전력" />
              <TabButton active={category === 'temperature'} onClick={() => setCategory('temperature')} icon={<Thermometer size={14} />} label="실내온도" />
              <TabButton active={category === 'resource'} onClick={() => setCategory('resource')} icon={<Printer size={14} />} label="종이절약" />
              <TabButton active={category === 'meals'} onClick={() => setCategory('meals')} icon={<Utensils size={14} />} label="잔반제로" />
              <TabButton active={category === 'transport'} onClick={() => setCategory('transport')} icon={<Car size={14} />} label="차량등하교" />
              <TabButton active={category === 'water'} onClick={() => setCategory('water')} icon={<Droplets size={14} />} label="수자원" />
              <TabButton active={category === 'digital'} onClick={() => setCategory('digital')} icon={<Smartphone size={14} />} label="디지털" />
              <TabButton active={category === 'consumption'} onClick={() => setCategory('consumption')} icon={<ShoppingBag size={14} />} label="일회용품" />
              <TabButton active={category === 'clothing'} onClick={() => setCategory('clothing')} icon={<Shirt size={14} />} label="교복물려입기" />
              <TabButton active={category === 'vegetarian'} onClick={() => setCategory('vegetarian')} icon={<Carrot size={14} />} label="초록식단" />
              <TabButton active={category === 'planting'} onClick={() => setCategory('planting')} icon={<Sprout size={14} />} label="식물가꾸기" />
              <TabButton active={category === 'recycling'} onClick={() => setCategory('recycling')} icon={<Recycle size={14} />} label="분리배출" />
              <TabButton active={category === 'custom'} onClick={() => setCategory('custom')} icon={<AlertCircle size={14} />} label="직접 입력" />
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="bg-gray-100 text-gray-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">3</span>
                환경 기초 데이터 입력
              </label>
              <button 
                onClick={fillSampleData}
                className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md hover:bg-green-100 transition-colors"
              >
                샘플 데이터 채우기
              </button>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="space-y-1 pb-2 border-b border-gray-100">
                <label className="text-xs font-bold text-gray-600">이름 / 학급명 (선택)</label>
                <input
                  type="text"
                  name="userName"
                  value={inputs.userName}
                  onChange={handleInputChange}
                  placeholder="예: 3학년 1반, 김환경"
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                />
              </div>
              {category === 'energy' && (
                <>
                  <InputField label="[학급당] 현재 월간 전력 사용량" name="energyCurrent" value={inputs.energyCurrent} onChange={handleInputChange} unit="kWh" placeholder="예: 400" />
                  <InputField label="[목표] 줄이고 싶은 전력량" name="energyReduction" value={inputs.energyReduction} onChange={handleInputChange} unit="kWh" placeholder="예: 40" />
                </>
              )}
              {category === 'temperature' && (
                <>
                  <InputField label="[학급당] 현재 평균 실내 온도" name="energyTempCurrent" value={inputs.energyTempCurrent} onChange={handleInputChange} unit="℃" placeholder="예: 24" />
                  <InputField label="[목표] 조절하고 싶은 실내 온도" name="energyTempTarget" value={inputs.energyTempTarget} onChange={handleInputChange} unit="℃" placeholder="예: 22" />
                </>
              )}
              {category === 'resource' && (
                <>
                  <InputField label="[1인당] 현재 월간 종이 사용량" name="resourceCurrent" value={inputs.resourceCurrent} onChange={handleInputChange} unit="장" placeholder="예: 50" />
                  <InputField label="[목표] 줄이고 싶은 종이 장수" name="resourceReduction" value={inputs.resourceReduction} onChange={handleInputChange} unit="장" placeholder="예: 10" />
                </>
              )}
              {category === 'meals' && (
                <>
                  <InputField label="[1인당] 현재 일일 잔반 발생량" name="mealsCurrent" value={inputs.mealsCurrent} onChange={handleInputChange} unit="g" placeholder="예: 100" />
                  <InputField label="[목표] 줄이고 싶은 잔반 무게" name="mealsReduction" value={inputs.mealsReduction} onChange={handleInputChange} unit="g" placeholder="예: 50" />
                </>
              )}
              {category === 'transport' && (
                <>
                  <InputField label="[학급당] 현재 차량 등교 학생 수" name="transportCurrent" value={inputs.transportCurrent} onChange={handleInputChange} unit="명" placeholder="예: 5" />
                  <InputField label="[목표] 도보/자전거로 바꿀 학생 수" name="transportReduction" value={inputs.transportReduction} onChange={handleInputChange} unit="명" placeholder="예: 2" />
                </>
              )}
              {category === 'water' && (
                <>
                  <InputField label="[1인당] 현재 월간 수도 사용량" name="waterCurrent" value={inputs.waterCurrent} onChange={handleInputChange} unit="톤" placeholder="예: 2" />
                  <InputField label="[목표] 줄이고 싶은 수도량" name="waterReduction" value={inputs.waterReduction} onChange={handleInputChange} unit="톤" placeholder="예: 0.5" />
                </>
              )}
              {category === 'digital' && (
                <>
                  <InputField label="[1인당] 현재 불필요한 이메일 보관량" name="digitalCurrent" value={inputs.digitalCurrent} onChange={handleInputChange} unit="건" placeholder="예: 100" />
                  <InputField label="[목표] 삭제하고 싶은 이메일 수" name="digitalReduction" value={inputs.digitalReduction} onChange={handleInputChange} unit="건" placeholder="예: 50" />
                </>
              )}
              {category === 'consumption' && (
                <>
                  <InputField label="[1인당] 현재 주간 일회용품 사용량" name="consumptionCurrent" value={inputs.consumptionCurrent} onChange={handleInputChange} unit="개" placeholder="예: 5" />
                  <InputField label="[목표] 줄이고 싶은 일회용품 수" name="consumptionReduction" value={inputs.consumptionReduction} onChange={handleInputChange} unit="개" placeholder="예: 2" />
                </>
              )}
              {category === 'clothing' && (
                <>
                  <InputField label="[학급당] 졸업생에게 물려받을 수 있는 교복 수" name="clothingCurrent" value={inputs.clothingCurrent} onChange={handleInputChange} unit="벌" placeholder="예: 10" />
                  <InputField label="[목표] 올해 물려 입기에 참여할 학생 수" name="clothingReduction" value={inputs.clothingReduction} onChange={handleInputChange} unit="명(벌)" placeholder="예: 3" />
                </>
              )}
              {category === 'vegetarian' && (
                <>
                  <InputField label="[학급당] 일반 육류 위주 급식 먹는 학생 수" name="vegetarianCurrent" value={inputs.vegetarianCurrent} onChange={handleInputChange} unit="명" placeholder="예: 30" />
                  <InputField label="[목표] 주 1회 '채식 급식'에 동참할 학생 수" name="vegetarianReduction" value={inputs.vegetarianReduction} onChange={handleInputChange} unit="명" placeholder="예: 10" />
                </>
              )}
              {category === 'planting' && (
                <>
                  <InputField label="[학급당] 현재 교실/화단에 있는 화분 수" name="plantingCurrent" value={inputs.plantingCurrent} onChange={handleInputChange} unit="개" placeholder="예: 10" />
                  <InputField label="[목표] 추가로 기르거나 심을 식물 수" name="plantingReduction" value={inputs.plantingReduction} onChange={handleInputChange} unit="개" placeholder="예: 5" />
                </>
              )}
              {category === 'recycling' && (
                <>
                  <InputField label="[학급당] 주간 발생 재활용 폐기량" name="recyclingCurrent" value={inputs.recyclingCurrent} onChange={handleInputChange} unit="kg" placeholder="예: 20" />
                  <InputField label="[목표] 올바르게 분리배출할 재활용량" name="recyclingReduction" value={inputs.recyclingReduction} onChange={handleInputChange} unit="kg" placeholder="예: 10" />
                </>
              )}
              {category === 'custom' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">데이터 이름</label>
                    <input type="text" name="customName" value={inputs.customName} onChange={handleInputChange} placeholder="예: 플라스틱 컵" className="w-full pl-3 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">단위</label>
                    <input type="text" name="customUnit" value={inputs.customUnit} onChange={handleInputChange} placeholder="예: 개, kg, L" className="w-full pl-3 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400" />
                  </div>
                  <InputField label="[학교 전체] 현재 사용량/배출량" name="customCurrent" value={inputs.customCurrent} onChange={handleInputChange} unit={inputs.customUnit || "단위"} placeholder="예: 500" />
                  <InputField label="[목표] 줄이고 싶은 양" name="customReduction" value={inputs.customReduction} onChange={handleInputChange} unit={inputs.customUnit || "단위"} placeholder="예: 100" />
                </>
              )}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span className="bg-gray-100 text-gray-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">4</span>
              출력 테마 선택
            </label>
            <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setTheme('chalkboard')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-xs font-bold transition-all ${
                  theme === 'chalkboard'
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Presentation size={14} />
                칠판
              </button>
              <button
                onClick={() => setTheme('sky')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-xs font-bold transition-all ${
                  theme === 'sky'
                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                    : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Cloud size={14} />
                하늘
              </button>
              <button
                onClick={() => setTheme('forest')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-xs font-bold transition-all ${
                  theme === 'forest'
                    ? 'bg-[#2D4A22] text-white shadow-sm'
                    : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <TreePine size={14} />
                숲
              </button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`mt-4 w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-sm ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                AI가 초고속 분석 중...
              </motion.span>
            </>
          ) : (
            <>
              <Monitor className="w-5 h-5" />
              <span>행동 지침 변환하기</span>
            </>
          )}
        </button>

        {/* Footer / Contact Info */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-1 text-center text-[11px] text-gray-400 pb-2">
          <p>문의: hjuni@korea.kr</p>
          <p>제작자: 수도권대기환경청 신현준 연구사</p>
        </div>
      </div>

      {/* Right Panel (Preview) */}
      <div ref={resultRef} className="flex-1 bg-gray-100 flex flex-col min-h-screen md:h-screen md:overflow-hidden print:h-auto print:overflow-visible">
        {/* Board Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full p-2 md:p-4 overflow-y-auto print:overflow-visible">
          <div
            ref={captureRef}
            className={`relative w-full max-w-5xl min-h-[300px] md:min-h-[60%] rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-700 my-auto print:shadow-none print:my-0 ${
              theme === 'chalkboard'
                ? 'bg-[#2A3B2C] border-[6px] md:border-[12px] border-[#5C4033] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]'
                : theme === 'forest'
                ? 'bg-gradient-to-br from-[#1B3B22] to-[#2D5A36] border-[4px] md:border-[8px] border-[#4A7C59] shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]'
                : 'bg-gradient-to-b from-blue-400 to-blue-100 border-[4px] md:border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
            }`}
          >
            {/* Decorative elements for Sky theme */}
            {theme === 'sky' && (
              <>
                <Cloud className="absolute top-12 left-12 text-white opacity-80 w-32 h-32 animate-[pulse_4s_ease-in-out_infinite]" />
                <Cloud className="absolute top-24 right-20 text-white opacity-60 w-24 h-24 animate-[pulse_5s_ease-in-out_infinite]" />
                <Sun className="absolute -top-10 -right-10 text-yellow-300 opacity-90 w-48 h-48 animate-[spin_60s_linear_infinite]" />
              </>
            )}

            {/* Decorative elements for Forest theme */}
            {theme === 'forest' && (
              <>
                <TreePine className="absolute bottom-0 left-10 text-[#4A7C59] opacity-40 w-48 h-48" />
                <TreePine className="absolute bottom-0 right-10 text-[#4A7C59] opacity-30 w-64 h-64" />
                <Leaf className="absolute top-10 left-20 text-[#88C096] opacity-60 w-16 h-16 animate-[pulse_4s_ease-in-out_infinite]" />
                <Leaf className="absolute top-20 right-32 text-[#88C096] opacity-50 w-12 h-12 animate-[pulse_5s_ease-in-out_infinite]" />
              </>
            )}

            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center text-center p-8 bg-red-50 border-2 border-red-200 rounded-3xl max-w-md"
                >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">오류가 발생했습니다</h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                  >
                    확인
                  </button>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
                  className="flex flex-col items-center text-center z-10 w-full max-w-4xl gap-3 md:gap-4"
                >
                  {/* 1. Main Message */}
                  <h2
                    className={`text-xl md:text-3xl lg:text-4xl font-black leading-tight tracking-tight px-2 ${
                      theme === 'chalkboard' || theme === 'forest' ? 'text-white drop-shadow-md' : 'text-gray-900 drop-shadow-sm'
                    }`}
                    style={{ wordBreak: 'keep-all' }}
                  >
                    {inputs.userName && (
                      <span className={`block text-sm md:text-xl font-bold mb-2 ${theme === 'chalkboard' ? 'text-yellow-300' : theme === 'forest' ? 'text-green-300' : 'text-green-600'}`}>{inputs.userName}의</span>
                    )}
                    {result.message}
                  </h2>

                  {/* Gamification Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6, delay: 0.5 }}
                    className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg bg-gradient-to-r ${getBadge(result.treesPlanted).color} text-white`}
                  >
                    <Award className="w-4 h-4 md:w-5 md:h-5" />
                    <div className="text-left">
                      <div className="text-xs md:text-sm font-black leading-tight">{getBadge(result.treesPlanted).title}</div>
                      <div className="text-[9px] md:text-[10px] font-medium opacity-90 leading-tight">{getBadge(result.treesPlanted).desc}</div>
                    </div>
                  </motion.div>

                  {/* 2. Before & After Chart */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`w-full max-w-2xl p-3 md:p-4 rounded-2xl backdrop-blur-md shadow-xl ${
                      theme === 'chalkboard' || theme === 'forest' ? 'bg-white/10 border border-white/20' : 'bg-white/60 border border-white/50'
                    }`}
                  >
                    <h3 className={`text-sm md:text-lg font-bold mb-2 md:mb-3 flex items-center justify-center gap-2 ${
                      theme === 'chalkboard' ? 'text-yellow-300' : theme === 'forest' ? 'text-green-300' : 'text-blue-800'
                    }`}>
                      우리가 실천하면 이렇게 바뀌어요! 📊
                    </h3>
                    
                    <div className="space-y-2 md:space-y-3">
                      {/* Before (Current) */}
                      <div className="text-left">
                        <div className={`flex justify-between mb-1 text-xs md:text-sm font-bold ${theme === 'chalkboard' || theme === 'forest' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>지금은... 😢</span>
                          <span>{result.currentValue.toLocaleString()} {result.unit}</span>
                        </div>
                        <div className="h-3 md:h-4 bg-black/20 rounded-full overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: result.targetValue < result.currentValue ? '100%' : `${getChartPercentage(result.currentValue, result.targetValue)}%` }} 
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${result.targetValue < result.currentValue ? 'bg-red-400' : 'bg-gray-400'}`}
                          />
                        </div>
                      </div>

                      {/* After (Target) */}
                      <div className="text-left">
                        <div className={`flex justify-between mb-1 text-sm md:text-base font-black ${theme === 'chalkboard' || theme === 'forest' ? 'text-green-400' : 'text-green-600'}`}>
                          <span>실천하면! 🤩</span>
                          <span>{result.targetValue.toLocaleString()} {result.unit}</span>
                        </div>
                        <div className="h-3 md:h-4 bg-black/20 rounded-full overflow-hidden relative shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: result.targetValue < result.currentValue ? `${getChartPercentage(result.currentValue, result.targetValue)}%` : '100%' }} 
                            transition={{ duration: 1, delay: 0.8, type: 'spring' }}
                            className="h-full bg-green-500 rounded-full relative overflow-hidden"
                          >
                            {/* Shimmer effect */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Items Checklist */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className={`relative w-full max-w-2xl p-3 md:p-4 rounded-2xl backdrop-blur-md shadow-xl text-left overflow-hidden ${
                      theme === 'chalkboard' || theme === 'forest' ? 'bg-white/10 border border-white/20' : 'bg-white/60 border border-white/50'
                    }`}
                  >
                    <AnimatePresence>
                      {isPledged && (
                        <motion.div
                          initial={{ opacity: 0, scale: 3, rotate: -20 }}
                          animate={{ opacity: 1, scale: 1, rotate: -5 }}
                          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                          className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 pointer-events-none z-50 flex items-center justify-center opacity-80"
                        >
                          <div className="w-16 h-16 md:w-20 md:h-20 border-[3px] md:border-[4px] border-red-500 rounded-full flex items-center justify-center rotate-[-15deg] shadow-xl relative bg-white/30 backdrop-blur-sm">
                            <div className="absolute inset-1 border-[1.5px] md:border-2 border-red-500 rounded-full border-dashed" />
                            <div className="text-center">
                              <div className="text-red-500 font-black text-sm md:text-base tracking-tighter leading-none font-serif pt-1">서약</div>
                              <div className="text-red-500 font-bold text-xs md:text-sm font-serif">완료</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <h3 className={`text-sm md:text-base font-bold mb-2 flex items-center gap-2 ${
                      theme === 'chalkboard' ? 'text-yellow-300' : theme === 'forest' ? 'text-green-300' : 'text-blue-800'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                      우리의 실천 약속
                    </h3>
                    <ul className="space-y-1.5 md:space-y-2">
                      {result.actionItems.map((item, index) => (
                        <li key={index} className={`flex items-start gap-2 text-xs md:text-sm font-medium ${
                          theme === 'chalkboard' || theme === 'forest' ? 'text-gray-100' : 'text-gray-700'
                        }`}>
                          <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                            theme === 'chalkboard' ? 'bg-yellow-400/20 text-yellow-300' : theme === 'forest' ? 'bg-green-400/20 text-green-300' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span style={{ wordBreak: 'keep-all' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* 3. Detailed Eco Stats Dashboard */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="w-full max-w-4xl grid grid-cols-3 gap-2 md:gap-4"
                  >
                    {/* Stat 1: Immediate Carbon Reduction */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-xl shadow-lg border-2 ${
                        theme === 'chalkboard' || theme === 'forest' ? 'bg-gray-800/80 border-gray-600 text-white' : 'bg-white/90 border-white text-gray-800'
                      }`}
                    >
                      <Wind className={`w-5 h-5 md:w-6 md:h-6 mb-1 ${theme === 'chalkboard' || theme === 'forest' ? 'text-blue-400' : 'text-blue-500'}`} />
                      <span className={`text-[10px] md:text-xs font-bold mb-0.5 ${theme === 'chalkboard' || theme === 'forest' ? 'text-gray-400' : 'text-gray-500'}`}>목표 달성 시</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg md:text-2xl font-black">{result.carbonReduction.toLocaleString()}</span>
                        <span className="text-[9px] md:text-[10px] font-bold">kg CO₂</span>
                      </div>
                    </motion.div>

                    {/* Stat 2: Yearly Carbon Reduction */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-xl shadow-lg border-2 ${
                        theme === 'chalkboard' || theme === 'forest' ? 'bg-gray-800/80 border-gray-600 text-white' : 'bg-white/90 border-white text-gray-800'
                      }`}
                    >
                      <Calendar className={`w-5 h-5 md:w-6 md:h-6 mb-1 ${theme === 'chalkboard' || theme === 'forest' ? 'text-purple-400' : 'text-purple-500'}`} />
                      <span className={`text-[10px] md:text-xs font-bold mb-0.5 ${theme === 'chalkboard' || theme === 'forest' ? 'text-gray-400' : 'text-gray-500'}`}>1년 지속 시</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{result.yearlyCarbonReduction.toLocaleString()}</span>
                        <span className="text-[9px] md:text-[10px] font-bold">kg CO₂</span>
                      </div>
                    </motion.div>

                    {/* Stat 3: Trees Planted */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-xl shadow-lg border-2 ${
                        theme === 'chalkboard' || theme === 'forest' ? 'bg-gray-800/80 border-gray-600 text-white' : 'bg-white/90 border-white text-gray-800'
                      }`}
                    >
                      <Sprout className={`w-5 h-5 md:w-6 md:h-6 mb-1 ${theme === 'chalkboard' || theme === 'forest' ? 'text-green-400' : 'text-green-500'}`} />
                      <span className={`text-[10px] md:text-xs font-bold mb-0.5 ${theme === 'chalkboard' || theme === 'forest' ? 'text-gray-400' : 'text-gray-500'}`}>나무 심는 효과</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{result.treesPlanted.toLocaleString()}</span>
                        <span className="text-[9px] md:text-[10px] font-bold">그루 🌲</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`flex flex-col items-center text-center opacity-60 ${
                    theme === 'chalkboard' || theme === 'forest' ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  <Monitor className="w-16 h-16 md:w-20 md:h-20 mb-4 opacity-30" />
                  <p className="text-base md:text-xl font-bold leading-relaxed">
                    왼쪽 패널에서 데이터를 입력하고<br/>
                    행동 지침을 생성해보세요.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Export Button (Outside the capture area) */}
          <AnimatePresence>
            {result && !error && (
              <motion.div
                data-html2canvas-ignore="true"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-6 flex flex-col items-center gap-3 print:hidden z-20 relative"
              >
                {!isPledged ? (
                  <button
                    onClick={handlePledge}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-black rounded-full shadow-lg hover:bg-red-600 hover:shadow-xl transition-all active:scale-95 text-sm md:text-base border-2 border-red-400 w-full md:w-auto"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    나는 실천을 약속합니다! 🙋‍♀️
                  </button>
                ) : (
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 font-bold rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95 text-xs md:text-sm"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      이미지로 저장하기
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 font-bold rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95 text-xs md:text-sm"
                    >
                      <Printer className="w-4 h-4 text-green-600" />
                      인쇄하기
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Info className="w-5 h-5 text-green-600" />
                  탄소 배출 계수 및 계산식 안내
                </h3>
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
                <section>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    기본 계산 공식
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 font-mono text-xs">
                    <p>• <span className="font-bold text-gray-900">단위 탄소 절감량</span> = 목표 절감량 × 항목별 탄소 배출 계수</p>
                    <p>• <span className="font-bold text-gray-900">연간 탄소 절감량</span> = 단위 절감량 × 연간 발생일수(등교일 200일, 12개월 등)</p>
                    <p>• <span className="font-bold text-gray-900">소나무 환산(그루)</span> = 연간 탄소 절감량 ÷ 6.6kg</p>
                    <p className="text-gray-500 mt-2 text-[10px]">* 30년생 소나무 1그루의 연간 이산화탄소 흡수량: 약 6.6kg (출처: Korea Forest Service)</p>
                  </div>
                </section>

                <section>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    항목별 탄소 배출 계수 (국가 표준 및 LCA 기반)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Zap className="w-24 h-24 absolute -right-4 -bottom-4 text-yellow-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-yellow-50 rounded-2xl shrink-0">
                        <Zap className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">전력 (에너지)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">0.4781 kgCO₂ / kWh</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 출처: GIR (2024)</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Thermometer className="w-24 h-24 absolute -right-4 -bottom-4 text-red-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-red-50 rounded-2xl shrink-0">
                        <Thermometer className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">실내 온도 조절</div>
                        <div className="text-green-600 font-mono font-bold text-sm">0.5 kgCO₂ / ℃ (일)</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 학급당 하루 절감 추정치</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Printer className="w-24 h-24 absolute -right-4 -bottom-4 text-green-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-green-50 rounded-2xl shrink-0">
                        <Printer className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">자원순환 (종이)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">0.00525 kgCO₂ / 장</div>
                        <div className="text-[10px] text-gray-500 mt-1">* A4 용지 1장(약 5g) 기준</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Utensils className="w-24 h-24 absolute -right-4 -bottom-4 text-orange-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-orange-50 rounded-2xl shrink-0">
                        <Utensils className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">음식물 쓰레기 (잔반)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">0.00165 kgCO₂ / g</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 출처: LCA (1.65 kgCO₂/kg)</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Car className="w-24 h-24 absolute -right-4 -bottom-4 text-gray-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-gray-50 rounded-2xl shrink-0">
                        <Car className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">생활/수송 (승용차)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">1.05 kgCO₂ / 명 (일)</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 왕복 5km 기준 (0.21/km)</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Droplets className="w-24 h-24 absolute -right-4 -bottom-4 text-blue-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-blue-50 rounded-2xl shrink-0">
                        <Droplets className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">수자원 (수도)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">0.332 kgCO₂ / 톤(m³)</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 출처: ME/KEITI (LCA)</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Smartphone className="w-24 h-24 absolute -right-4 -bottom-4 text-purple-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-purple-50 rounded-2xl shrink-0">
                        <Smartphone className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">디지털 (이메일/앱)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">0.004 kgCO₂ / 건</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 출처: Mike Berners-Lee</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <ShoppingBag className="w-24 h-24 absolute -right-4 -bottom-4 text-pink-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-pink-50 rounded-2xl shrink-0">
                        <ShoppingBag className="w-6 h-6 text-pink-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">플라스틱 (일회용품)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">0.086 kgCO₂ / 개</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 출처: KEITI</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Shirt className="w-24 h-24 absolute -right-4 -bottom-4 text-indigo-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-indigo-50 rounded-2xl shrink-0">
                        <Shirt className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">의류 (교복 대물림)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">15 kgCO₂ / 벌</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 일반 의류 1벌 생산 기준</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Carrot className="w-24 h-24 absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-emerald-50 rounded-2xl shrink-0">
                        <Carrot className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">채식 식단 (녹색급식)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">1.5 kgCO₂ / 기 (명)</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 육류 식단 대비 1끼 절감량</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Sprout className="w-24 h-24 absolute -right-4 -bottom-4 text-green-600/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-green-50 rounded-2xl shrink-0">
                        <Sprout className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">탄소 흡수 (식물가꾸기)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">2.5 kgCO₂ / 화분(연)</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 소형 반려식물 기준 추정치</div>
                      </div>
                    </div>

                    <div className="bg-white relative overflow-hidden p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                      <Recycle className="w-24 h-24 absolute -right-4 -bottom-4 text-blue-500/5 group-hover:scale-110 transition-transform" />
                      <div className="p-3 bg-blue-50 rounded-2xl shrink-0">
                        <Recycle className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-gray-900 mb-0.5">자원순환 (분리배출)</div>
                        <div className="text-green-600 font-mono font-bold text-sm">1.5 kgCO₂ / kg</div>
                        <div className="text-[10px] text-gray-500 mt-1">* 고품질 재활용 소각 회피 기준</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="px-6 py-2 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
        active
          ? 'bg-white text-gray-900 shadow-sm'
          : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className={active ? 'text-green-600' : 'text-gray-400'}>{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function InputField({ label, name, value, onChange, unit, placeholder }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; unit: string; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-600">{label}</label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-3 pr-12 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 text-xs font-bold">{unit}</span>
        </div>
      </div>
    </div>
  );
}

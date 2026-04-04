import React, { useState, useRef, useEffect } from 'react';
import { Leaf, Zap, Recycle, Utensils, Car, Monitor, Cloud, Presentation, Loader2, CheckCircle2, Sun, TreePine, Snowflake, Globe2, Coins, ArrowRight, Wind, Calendar, Sprout, Droplets, Smartphone, ShoppingBag, ArrowDown, AlertCircle, Download, Award, Share2, Printer, Thermometer, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

type SchoolLevel = '초등학교' | '중학교' | '고등학교';
type Category = 'energy' | 'temperature' | 'resource' | 'meals' | 'transport' | 'water' | 'digital' | 'consumption' | 'custom';
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
  const resultRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null); // For image export

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  const [inputs, setInputs] = useState({
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

    switch (category) {
      case 'energy':
        carbonPerUnit = 0.4781;
        yearlyMultiplier = 12; // 월간 -> 연간
        visualTheme = 'money';
        message = '에너지 절약으로 지구를 시원하게! ⚡';
        effect = '우리 반의 전력 사용량을 줄여 온실가스 배출을 크게 감소시켰습니다.';
        actionItems = ['빈 교실 불 끄기', '사용하지 않는 플러그 뽑기', '자연 채광 활용하기'];
        break;
      case 'temperature':
        carbonPerUnit = 0.5; // 학급당 1도 조절 시 하루 약 0.5kg 절감 추정
        yearlyMultiplier = 100; // 냉난방 가동일 약 100일
        visualTheme = 'ice';
        message = '적정 온도 유지로 북극곰을 살려요! 🐻‍❄️';
        effect = '우리 반 냉난방기 온도를 조절해 에너지를 절약하고 북극의 얼음을 지킵니다.';
        actionItems = ['여름철 26도, 겨울철 20도 유지하기', '냉난방기 가동 시 창문 닫기', '계절에 맞는 옷차림 하기'];
        break;
      case 'resource':
        carbonPerUnit = 0.00525;
        yearlyMultiplier = 12; // 월간 -> 연간
        visualTheme = 'tree';
        message = '종이 절약으로 숲을 보호해요! 🌲';
        effect = '나의 종이 사용을 줄여 나무를 베는 것을 막고 숲을 보존합니다.';
        actionItems = ['이면지 활용하기', '태블릿/노트북으로 디지털 필기하기', '꼭 필요한 인쇄만 양면으로 하기'];
        break;
      case 'meals':
        carbonPerUnit = 0.00165; // 1.65 kgCO2/kg -> 0.00165 kgCO2/g
        yearlyMultiplier = 200; // 급식일 약 200일
        visualTheme = 'earth';
        message = '잔반 없는 날, 지구가 웃는 날! 🍽️';
        effect = '내가 남기지 않은 음식물이 메탄가스 발생을 막아줍니다.';
        actionItems = ['먹을 만큼만 배식받기', '편식하지 않고 골고루 먹기', '잔반 없는 날 적극 참여하기'];
        break;
      case 'transport':
        carbonPerUnit = 1.05; // 왕복 5km 기준 (5 * 0.21)
        yearlyMultiplier = 200; // 등교일 약 200일
        visualTheme = 'earth';
        message = '두 발로 걷고, 자전거 타고! 🚲';
        effect = '차량 대신 도보나 대중교통을 이용해 대기 오염을 막고 탄소 배출을 줄입니다.';
        actionItems = ['가까운 거리는 걷거나 자전거 타기', '대중교통 이용하기', '스쿨버스 이용하기'];
        break;
      case 'water':
        carbonPerUnit = 0.332;
        yearlyMultiplier = 12; // 월간 -> 연간
        visualTheme = 'ice';
        message = '물 한 방울도 소중하게! 💧';
        effect = '나의 물 절약이 수자원을 보호하고 정수 과정의 에너지를 아낍니다.';
        actionItems = ['양치할 때 양치컵 사용하기', '비누칠 할 때 물 끄기', '변기 수조에 벽돌/페트병 넣기'];
        break;
      case 'digital':
        carbonPerUnit = 0.004;
        yearlyMultiplier = 1; // 누적 데이터 삭제는 1회성
        visualTheme = 'tree';
        message = '디지털 다이어트로 탄소 다이어트! 📱';
        effect = '내 메일함의 불필요한 데이터를 지워 데이터센터의 전력 사용을 줄입니다.';
        actionItems = ['스팸 메일 차단 및 불필요한 메일 삭제하기', '동영상 스트리밍 해상도 낮추기', '사용하지 않는 앱 삭제하기'];
        break;
      case 'consumption':
        carbonPerUnit = 0.086; // 2.15 kgCO2/kg * 0.04 kg/item
        yearlyMultiplier = 40; // 학사일정 약 40주
        visualTheme = 'earth';
        message = '일회용품 NO, 다회용품 YES! 텀블러 챙기기 🥤';
        effect = '나의 다회용품 사용이 플라스틱 쓰레기를 줄이고 해양 생태계를 보호합니다.';
        actionItems = ['개인 텀블러 사용하기', '장바구니 챙기기', '플라스틱 빨대 사용하지 않기'];
        break;
      case 'custom':
      default:
        carbonPerUnit = 1.0;
        yearlyMultiplier = 200;
        visualTheme = 'tree';
        message = `${categoryName} 줄이기로 탄소중립 실천! 🌟`;
        effect = `일상 속 작은 실천으로 탄소 배출을 줄이고 환경을 보호합니다.`;
        actionItems = ['꾸준히 실천하기', '친구들에게 알리기', '새로운 목표 세우기'];
        break;
    }

    const carbonReduction = reductionTarget * carbonPerUnit;
    const yearlyCarbonReduction = carbonReduction * yearlyMultiplier;
    const treesPlanted = yearlyCarbonReduction / 6.6;

    return {
      message,
      effect,
      currentValue: baseValue,
      targetValue: baseValue - reductionTarget,
      unit,
      visualTheme,
      carbonReduction: Number(carbonReduction.toFixed(2)),
      yearlyCarbonReduction: Number(yearlyCarbonReduction.toFixed(2)),
      treesPlanted: Number(treesPlanted.toFixed(1)),
      actionItems,
    };
  };

  const handleGenerate = async () => {
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
          <button 
            onClick={() => setShowInfoModal(true)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
            title="계산 기준 보기"
          >
            <Info className="w-5 h-5" />
          </button>
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
              <TabButton active={category === 'resource'} onClick={() => setCategory('resource')} icon={<Recycle size={14} />} label="자원순환" />
              <TabButton active={category === 'meals'} onClick={() => setCategory('meals')} icon={<Utensils size={14} />} label="녹색급식" />
              <TabButton active={category === 'transport'} onClick={() => setCategory('transport')} icon={<Car size={14} />} label="생활/수송" />
              <TabButton active={category === 'water'} onClick={() => setCategory('water')} icon={<Droplets size={14} />} label="수자원" />
              <TabButton active={category === 'digital'} onClick={() => setCategory('digital')} icon={<Smartphone size={14} />} label="디지털" />
              <TabButton active={category === 'consumption'} onClick={() => setCategory('consumption')} icon={<ShoppingBag size={14} />} label="친환경 소비" />
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
                    className={`w-full max-w-2xl p-3 md:p-4 rounded-2xl backdrop-blur-md shadow-xl text-left ${
                      theme === 'chalkboard' || theme === 'forest' ? 'bg-white/10 border border-white/20' : 'bg-white/60 border border-white/50'
                    }`}
                  >
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-2 flex gap-2 md:gap-4 print:hidden"
              >
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500"/> 전력 (에너지)</div>
                      <div className="text-green-600 font-mono font-bold">0.4781 kgCO₂ / kWh</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">* 출처: GIR (2024)</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-red-500"/> 실내 온도 조절</div>
                      <div className="text-green-600 font-mono font-bold">0.5 kgCO₂ / ℃ (일)</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">* 학급당 하루 절감 추정치</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><Recycle className="w-3.5 h-3.5 text-green-500"/> 자원순환 (종이)</div>
                      <div className="text-green-600 font-mono font-bold">0.00525 kgCO₂ / 장</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">* A4 용지 1장(약 5g) 기준</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5 text-orange-500"/> 음식물 쓰레기 (잔반)</div>
                      <div className="text-green-600 font-mono font-bold">0.00165 kgCO₂ / g</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">* 출처: LCA Analysis (1.65 kgCO₂/kg)</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-gray-500"/> 생활/수송 (승용차)</div>
                      <div className="text-green-600 font-mono font-bold">1.05 kgCO₂ / 명 (일)</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">* 왕복 5km 기준 (0.21 kgCO₂/km)</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-400"/> 수자원 (수도)</div>
                      <div className="text-green-600 font-mono font-bold">0.332 kgCO₂ / 톤(m³)</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">* 출처: ME/KEITI (LCA)</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-purple-500"/> 디지털 (이메일)</div>
                      <div className="text-green-600 font-mono font-bold">0.004 kgCO₂ / 건</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">* 출처: Mike Berners-Lee</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5 text-pink-500"/> 플라스틱 (PET)</div>
                      <div className="text-green-600 font-mono font-bold">0.086 kgCO₂ / 개</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">* 출처: KEITI (2.15 kgCO₂/kg × 0.04kg/개)</div>
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

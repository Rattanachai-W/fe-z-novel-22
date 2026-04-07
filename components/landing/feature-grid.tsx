import { 
  FiBookOpen, 
  FiGift, 
  FiZap, 
  FiUsers,
  FiAward,
  FiShoppingBag
} from "react-icons/fi";

const features = [
  {
    name: 'Advanced Reading Engine',
    description: 'ระบบอ่านนิยายที่ออกแบบมาเพื่อความสบายตา ปรับแต่งได้ตามใจชอบ พร้อมโหมดถนอมสายตาสำหรับนักอ่านตัวจริง',
    icon: FiBookOpen,
  },
  {
    name: 'Dino Gacha System',
    description: 'สุ่มรับของรางวัลสุดพรีเมียม ทั้งเหรียญทอง ตั๋วสุ่ม และสิทธิ์แลกของรางวัลจริงในโลกภายนอก',
    icon: FiGift,
  },
  {
    name: 'ReadList Ecosystem',
    description: 'เพลย์ลิสต์นิยายที่คุณสร้างเองได้ แชร์ให้เพื่อน หรือติดตาม Top Curators เพื่อค้นพบนิยายโดนใจ',
    icon: FiZap,
  },
  {
    name: 'Physical Rewards',
    description: 'ไม่ได้มีแค่ในจอ! แลกรับของรางวัลจริง (Physical Goods) จากการสะสม Dino Egg และการทำภารกิจ',
    icon: FiShoppingBag,
  },
  {
    name: 'Creator Dashboard',
    description: 'เครื่องมือสำหรับนักเขียนที่ครบครัน วิเคราะห์สถิติ จัดการรายได้ และใกล้ชิดกับเหล่านักอ่าน',
    icon: FiAward,
  },
  {
    name: 'Dino Community',
    description: 'พื้นที่สำหรับพูดคุย แลกเปลี่ยน และทำภารกิจร่วมกันเพื่อรับรางวัลใหญ่ประจำซีซั่น',
    icon: FiUsers,
  },
];

export function FeatureGrid() {
  return (
    <div id="features" className="bg-slate-50 dark:bg-slate-900/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#42b983]">The Dino Experience</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            ทุกอย่างที่คุณต้องการในแพลตฟอร์มนิยายยุคใหม่
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            DinoNovel ไม่ใช่แค่แอปอ่านนิยาย แต่คือ Digital Playground ที่ให้คุณสนุกไปกับเรื่องราวและรับรางวัลจริงไปพร้อมกัน
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#42b983]">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

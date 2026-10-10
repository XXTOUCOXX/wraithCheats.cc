export interface SetupStep {
  title: string;
  body: string;
  note?: { label: string; text: string };
  image: string;
  actions?: { href: string; label: string; ghost?: boolean }[];
}

export const SETUP_STEPS: SetupStep[] = [
  {
    title: 'Buy your license key.',
    body: 'Pick a tier on the store page, Elite or Platinum. Pay once. Your license key is delivered instantly to the email you used at checkout.',
    note: { label: 'Note', text: "Check your spam folder if the key doesn't arrive within 60 seconds." },
    image: '/setup/scooby/1.jpg',
    actions: [{ href: '/buy', label: 'Go to store' }],
  },
  {
    title: 'Sign in with Scooby.',
    body: 'Wraith accounts are Scooby accounts. If you already have one, just sign in. New rider? Register on the Scooby portal in under a minute.',
    note: { label: 'Note', text: 'Your Wraith license is bound to this account. Keep your credentials safe.' },
    image: '/setup/scooby/2.jpg',
    actions: [
      { href: '/login', label: 'Sign in' },
      { href: '/register', label: 'Register', ghost: true },
    ],
  },
  {
    title: 'Redeem the key.',
    body: 'Open your dashboard and paste the license key you received. Wraith is tied to your account, no further activation needed.',
    note: { label: 'Format', text: 'WRTH-XXXX-XXXX-XXXX-XXXX' },
    image: '/setup/scooby/3.jpg',
    actions: [{ href: '/dashboard', label: 'Open dashboard' }],
  },
  {
    title: 'Load Scooby in-game.',
    body: 'Launch RedM, join your server, and inject Scooby Menu with your executor. Wait for the Scooby UI to appear.',
    note: { label: 'Note', text: "Your executor must already have Scooby auto-loading. If not, see Scooby's own setup docs first." },
    image: '/setup/scooby/4.jpg',
  },
  {
    title: 'Open the Lua tab, then Library.',
    body: 'Inside the Scooby UI, open the Lua tab, then click the Library subtab. This is where your installed scripts and extensions appear.',
    note: { label: 'Note', text: 'The Library subtab sits in the secondary row once Lua is open.' },
    image: '/setup/scooby/5.jpg',
  },
  {
    title: 'Go to Premium Menus.',
    body: 'Inside the Lua tab, find the Premium Menus subtab. Wraith and other licensed extensions live here.',
    note: {
      label: 'Note',
      text: 'If "Premium Menus" doesn\'t appear, your account isn\'t linked yet. Go back to step 3 and confirm your license is redeemed.',
    },
    image: '/setup/scooby/6.jpg',
  },
  {
    title: 'Find Wraith. Click View.',
    body: 'Locate Wraith in the Premium Menus list and hit View next to it. This brings up the load panel.',
    note: { label: 'Tier', text: 'Elite and Platinum show up the same here. Your tier is checked at load time.' },
    image: '/setup/scooby/7.jpg',
  },
  {
    title: 'Press Load Script.',
    body: 'Hit Load Script. The wraith arrives, your menu unlocks, and you are free to ride.',
    note: { label: 'First run', text: 'Initial load takes about 2 seconds while the model library indexes. After that it is instant.' },
    image: '/setup/scooby/8.jpg',
  },
];

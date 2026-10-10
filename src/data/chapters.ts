export interface Chapter {
  id: string;
  numeral: string;
  kicker: string;
  title: string;
  pitch: string;
  bullets: string[];
  tier: string;
  art: string;
  /** object-position for the art, keeps the subject in frame on wide/narrow screens */
  focus?: string;
  /** optional MP4 loop that replaces the still once gameplay footage exists */
  video?: string;
  stats?: { value: string; label: string }[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'self',
    numeral: 'I',
    kicker: 'The Self',
    title: 'Untouchable.',
    pitch: 'Every player-side dial in one place. Heal, harden, vanish, fly. The frontier stops hurting.',
    bullets: [
      'God mode, auto-heal, armor & infinite stamina',
      'Noclip, freecam with an action wheel, invisibility',
      'Super speed, super jump, walk on water, no fall damage',
      'Horse god mode, bonding, auto-mount & care',
      'Change ped, model presets, honor & aura controls',
    ],
    tier: 'Elite & Platinum',
    art: 'self',
    focus: '78% 50%',
  },
  {
    id: 'gun',
    numeral: 'II',
    kicker: 'The Gun',
    title: 'Never miss.',
    pitch: 'Complete loadouts, tuned aim and rounds that end arguments. 73 weapons, 64 ammo types.',
    bullets: [
      'Aimbot, lock-on, triggerbot & silent aim',
      'Complete loadouts with save, restore & randomize',
      'Infinite ammo, perfect accuracy, no recoil or spread',
      'Explosive & fire rounds, damage modifier, one-shot',
    ],
    tier: 'Elite & Platinum',
    art: 'gun',
    focus: '82% 60%',
  },
  {
    id: 'hunt',
    numeral: 'III',
    kicker: 'The Hunt',
    title: 'Every rider, yours.',
    pitch: 'Pick a player and open 140+ actions: spectate, follow, spawn on, or bring the whole frontier down on them.',
    bullets: [
      'Spectate, teleport to & spawn on any player',
      'Freeze, lightning, drone strikes & sky barrages',
      'Bounty posses, snipers & Gatling wagon ambushes',
      'Mounted chaos: buck rider, panic & launch mount',
      'Platinum: OP troll, fake messages & server economy',
    ],
    tier: 'Platinum unlocks the full suite',
    art: 'hunt',
    focus: '72% 50%',
  },
  {
    id: 'land',
    numeral: 'IV',
    kicker: 'The Land',
    title: 'Bend the world.',
    pitch: 'Weather, time and every model RedM ships with, searchable and one click from spawning.',
    bullets: [
      'Live-filterable Model Library across the full model set',
      'Weather & time presets, wind and world chaos events',
      'Vehicle fly, god mode, speed boost & spawner',
      'Teleports to towns, camps, saloons & hideouts',
    ],
    tier: 'Elite & Platinum',
    art: 'land',
    focus: '70% 60%',
    stats: [
      { value: '1,800+', label: 'NPC peds' },
      { value: '106', label: 'Horses' },
      { value: '116', label: 'Vehicles' },
      { value: '1,400+', label: 'Objects' },
    ],
  },
  {
    id: 'sight',
    numeral: 'V',
    kicker: 'The Sight',
    title: 'See them first.',
    pitch: 'Know who is out there before they know you are. Full ESP with color presets that stay readable at night.',
    bullets: [
      'Name, health & distance tags',
      '3D & 2D boxes, skeleton, snap lines & chams',
      'Player and animal ESP with color presets',
      'Info overlays: coordinates, server & target readout',
    ],
    tier: 'Elite & Platinum',
    art: 'sight',
    focus: '80% 50%',
  },
];

export const STEPS = [
  { title: 'Buy', text: 'Pick Elite or Platinum. One-time payment, key delivered instantly.' },
  { title: 'Sign in', text: 'Use your Scooby account. No separate Wraith account needed.' },
  { title: 'Redeem', text: 'Paste your key in the dashboard. Wraith binds to your account.' },
  { title: 'Load', text: 'In Scooby: Lua › Premium Menus › Wraith › Load Script.' },
];

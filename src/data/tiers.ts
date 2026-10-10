export type TierId = 'elite' | 'platinum';

export interface FeatureGroup {
  label: string;
  items: string[];
  exclusive?: boolean;
}

export interface Tier {
  id: TierId;
  name: string;
  price: number;
  per: string;
  pitch: string;
  checkout: string;
  featured?: boolean;
  highlights: string[];
  groups: FeatureGroup[];
  notIncluded?: string[];
}

const STORE = 'https://zscooby.myshopify.com/products';

export const TIERS: Tier[] = [
  {
    id: 'elite',
    name: 'Elite',
    price: 15,
    per: 'One-time · lifetime access',
    pitch:
      'All the essentials. Solo riding, world control and the full Model Library, enough to dominate without going nuclear.',
    checkout: `${STORE}/wraith-elite`,
    highlights: ['God mode, noclip & freecam', 'Aimbot & full ESP', 'Troll suite & spawner', 'Server rewards on 10+ servers'],
    groups: [
      {
        label: 'Self',
        items: [
          'God Mode · Heal · Armor · Auto Heal',
          'Super Speed · Infinite Stamina · Fly Mode',
          'Noclip · Freecam · Invisible · Fake Death',
          'Full Model Library: peds, animals, vehicles',
        ],
      },
      {
        label: 'Weapons & aimbot',
        items: [
          'Complete Loadout · Infinite Ammo · Perfect Accuracy',
          'Aimbot · Lock-On · Controller Aim Assist',
          'Explosive Rounds · Fire Rounds · Damage Modifier',
        ],
      },
      {
        label: 'Full ESP',
        items: ['Name · Health · Distance', '3D Box · 2D Box · Skeleton · Snap Lines · Chams'],
      },
      {
        label: 'Players & troll',
        items: [
          'Freeze · Explode · Lightning Strike · Drone Strike',
          'Clone attacks · Animal swarms · Prop attachments',
          'Teleport to Player · Spectate · Spawn on Player',
        ],
      },
      {
        label: 'World & server',
        items: [
          'Weather · Time · Wind effects',
          'Server Rewards: money & XP across 10+ servers',
          'Vehicle Fly · God Mode · Speed Boost · Spawner',
        ],
      },
    ],
    notIncluded: [
      'Crash / Lag Player',
      'Silent Kill · Fake Admin Messages',
      'Server economy (steal gold, jail)',
      'Anti-Teleport · Anti-Spectate · Crash Protection',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 25,
    per: 'One-time · recommended',
    pitch:
      'The full arsenal. Everything in Elite plus the offensive toolkit: OP troll, fake messages, server economy and protections.',
    checkout: `${STORE}/wraith-platinum-redm`,
    featured: true,
    highlights: ['Everything in Elite', 'OP troll suite', 'Fake chat & admin messages', 'Protections & anti-crash'],
    groups: [
      {
        label: 'Everything in Elite',
        items: ['All self tools, aimbot, full ESP, weapons, troll suite, server rewards & more'],
      },
      {
        label: 'OP troll',
        exclusive: true,
        items: ['Crash Player · Crash Permanently', 'Lag Player · Ultimate Lag · BlackHole', 'Silent Kill · Silent Explosion'],
      },
      {
        label: 'Fake messages',
        exclusive: true,
        items: ['Send fake chat as any player', 'Fake Admin announcements & messages'],
      },
      {
        label: 'Server economy',
        exclusive: true,
        items: ['Steal Gold · Steal Cash (stealth)', 'Send to Jail · Cuff Player'],
      },
      {
        label: 'Protections',
        exclusive: true,
        items: ['Anti-Teleport · Anti-Spectate', 'Crash Protection'],
      },
    ],
  },
];

/** Rows for the comparison table: [feature, elite, platinum]. */
export const COMPARE: [string, boolean, boolean][] = [
  ['Self tools: god mode, noclip, freecam, fly', true, true],
  ['Weapons, loadouts & aimbot', true, true],
  ['Full ESP: boxes, skeleton, chams', true, true],
  ['Players & troll suite', true, true],
  ['World, weather & time', true, true],
  ['Model Library & spawner', true, true],
  ['Server rewards (10+ servers)', true, true],
  ['OP troll: crash, lag, BlackHole, silent kill', false, true],
  ['Fake chat & admin messages', false, true],
  ['Server economy: steal gold & cash, jail, cuff', false, true],
  ['Protections: anti-teleport, anti-spectate, anti-crash', false, true],
];

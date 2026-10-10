export type ChangeKind = 'added' | 'changed' | 'fixed' | 'removed';

export interface Release {
  version: string;
  type: 'Major' | 'Minor' | 'Patch' | 'Beta';
  date: string;
  summary: string;
  changes: Partial<Record<ChangeKind, string[]>>;
}

/** Newest first. The first entry is shown as the current build across the site. */
export const RELEASES: Release[] = [
  {
    version: '1.2.1',
    type: 'Minor',
    date: '2026-08-24',
    summary: 'Cleaner paths. Maximum frontier chaos.',
    changes: {
      added: [
        'Target disruption: Stumble Loop repeatedly knocks a selected player down, while Disarm Loop repeatedly strips their equipped weapons',
        'Mounted chaos: Buck Rider, Panic Mount, and Launch Mount & Rider bring three new ways to disrupt mounted players',
        'Sky barrages: rain arrows, tomahawks, or timed dynamite waves around a moving target',
        'Armed ambushes: surround a player with a bounty hunter posse, distant snipers, or a crewed Gatling wagon',
        'Chaos physics: Target Magnet, Entity Orbit, Fire Trail, and Explosive Barrel Ring turn the area surrounding a player into a moving hazard',
        'Per-target cleanup: Clear Target Chaos stops active effects and removes spawned ambushes, vehicles, barrels, and dynamite tied to that player',
      ],
      changed: [
        'Main menu reorganized: nine focused categories now group Self, Players, Combat, Travel, World, Spawner, Visuals, Server, and Tools & Settings',
        'Player actions simplified: target menus now use six clear sections, with related spawn, attack, advanced, and server actions grouped together',
        'Vehicle, protection, and settings cleanup: long option lists are split into focused submenus without removing features',
        'Duplicate routes removed: notifications, menu position, configuration, utilities, weather presets, and ESP colors now have one consistent visible location',
        'Compatibility preserved: existing hotkeys, callbacks, saved settings, and legacy menu links continue to work with the new layout',
      ],
    },
  },
  {
    version: '1.1.0',
    type: 'Minor',
    date: '2026-05-09',
    summary: 'Freecam overhaul & frontier arsenal.',
    changes: {
      added: [
        'Wraith freecam action wheel: raycast-driven freecam actions for teleporting, shooting, exploding, deleting entities, spawning objects/vehicles/peds/animals, grabbing entities, tracking targets, and saving/loading camera positions',
        'Freecam controls panel: on-screen controls, target readout, mode cycling, sub-list cycling, plus adjustable freecam speed and sensitivity',
        'Teleport presets: quick teleports for major towns, train stops, saloons, sheriffs, camps, hideouts, landmarks, and a forward-teleport shortcut',
        'Self and horse tools: regen boosts, Dead Eye/Eagle Eye protections, survival toggles, self revive, stress reset, horse care, horse bonding, horse follow, auto-mount, and Arabian horse spawns',
        'Movement and appearance options: super jump, anti-stumble, no knockback, no fall damage, walk on water, sprint-anywhere, air brake, silent movement, random looks, model presets, mask controls, honor controls, and aura effects',
        'HUD, combat, and loadout controls: HUD visibility toggles, HUD scale, loadout save/restore/randomizer, weapon category grants, ammo/tonic refills, advanced round types, one-shot, recoil/spread controls, aimbot tuning, triggerbot, silent aim, and NPC combat actions',
        'World, vehicle, protection, and info tools: weather/time presets, world chaos events, population controls, visual filters, vehicle handling controls, current-vehicle actions, anti-grief protections, extra info overlays, coordinate/server copy buttons, resource refresh, console log toggle, and disconnect action',
      ],
      changed: ['Freecam moved into its own Self tab: Freecam now has a dedicated tab instead of sharing the Movement section'],
    },
  },
  {
    version: '1.0.0',
    type: 'Major',
    date: '2026-04-25',
    summary: 'Frontier launch. The wraith rides.',
    changes: {
      added: [
        'Full hierarchical menu with 10 top-level categories',
        'Model Library: 1,800+ NPCs, 200 animals, 106 horses, 116 vehicles, 1,400 objects',
        'Player tools: heal, max stats, change ped, godmode, horse godmode',
        'Movement: free-cam, noclip, invisibility, teleport-to-marker',
        'Per-player toolkit: troll, props, spawn-on, gang/crowd, OP troll',
        'Animals ESP with 3D / 2D boxes, chams, name, health, distance',
        'Weather, time, and 2,500+ music event triggers',
        'License-key activation tied to executor',
      ],
    },
  },
  {
    version: '0.9.4',
    type: 'Beta',
    date: '2026-04-18',
    summary: 'Closed-beta polish & key activation.',
    changes: {
      added: [
        'License-key dashboard with reveal & copy',
        'Email verification on register',
        'Reset-password flow with 6-digit code',
        'Notifications toggle, preview, queue clear',
      ],
      changed: ['Renamed Config Browser → Model Library', 'Compacted ped lists for faster open on lower-spec machines'],
      fixed: [
        'Aimbot occasionally stuck on first target after respawn',
        'Crosshair (2) leaking through pause menu',
        'Teleport-to-marker landing one tile west on snow biomes',
      ],
    },
  },
  {
    version: '0.9.0',
    type: 'Minor',
    date: '2026-04-02',
    summary: 'Per-player toolkit lands.',
    changes: {
      added: [
        'Players selector with full Troll / Props / Spawn-on submenus',
        'Clone Attacker / Clone Follow / Clone Lasso variants',
        'OP Troll: fake messages, fake announcements, lag tools',
        'Server & economy hooks for Bandera, Yellowstone, DRB, Dakota SV',
      ],
      changed: ['Menu open/close transitions tightened (220ms → 140ms)', 'Bandolier UI accent color across all submenus'],
    },
  },
  {
    version: '0.8.2',
    type: 'Patch',
    date: '2026-03-14',
    summary: 'Stability & combat tuning.',
    changes: {
      fixed: [
        'Best Fighter toggle desyncing after horse mount',
        'Infinite Ammo not respecting clip size on shotguns',
        'Free-cam jitter on ultrawide aspect ratios',
      ],
      removed: ['Legacy "Crosshair (1)" placeholder (replaced by CROSSHAIR 1)'],
    },
  },
  {
    version: '0.8.0',
    type: 'Minor',
    date: '2026-02-28',
    summary: 'Model Library & Scooby Menu integration.',
    changes: {
      added: [
        'Initial Scooby Menu hook: auto-loads in executor',
        'Model Library with live filtering across full RedM model set',
        'Weapons categorized: melee, pistols, revolvers, repeaters, rifles, shotguns, bows, throwables',
      ],
    },
  },
];

export const CURRENT_VERSION = RELEASES[0].version;

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

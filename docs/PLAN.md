# PatchDrive Game Plan

## Core Idea

PatchDrive is an endless physics survival web game. The player chooses a vehicle, survives as long as possible through terrain, flight, space movement, disasters, and random part failures. When parts break, the player draws replacement parts on a canvas and installs them into the vehicle.

The game is never-ending like the classic dinosaur runner, but the main twist is that the player does not only dodge obstacles. The player must keep a damaged machine alive by drawing emergency repairs under pressure.

## Main Game Loop

1. Player chooses a vehicle in the garage.
2. The run starts and the vehicle moves through an endless world.
3. Physics affects the vehicle: gravity, friction, lift, drag, thrust, grip, stability, weight, momentum, and impact force.
4. Natural disasters and hazards appear over time.
5. Vehicle parts become damaged.
6. Player draws a replacement part on the repair canvas.
7. The game scores the drawing quality.
8. Better drawings create stronger, longer-lasting repairs.
9. The player earns coins while surviving.
10. After the run ends, the player spends coins on upgrades.
11. The player starts again and tries to beat the best score.

## Vehicle Types

PatchDrive should include many vehicle categories, not just cars.

### Ground Vehicles

- Bike
- Car
- Truck
- Buggy
- Tank-like vehicle

Ground vehicles use:

- gravity
- tire grip
- friction
- suspension
- traction
- torque
- skidding
- rolling resistance
- weight transfer
- impact damage
- terrain resistance

### Air Vehicles

- Airplane
- Jet
- Helicopter

Air vehicles use:

- lift
- drag
- thrust
- stall pressure
- wind force
- turbulence
- pitch
- roll
- yaw
- landing impact
- engine heat
- wing or rotor damage

Air vehicle examples:

- Airplanes need forward speed and lift.
- Jets have stronger thrust but build heat faster.
- Helicopters can stay in the air more easily but are less stable in storms.

### Space Vehicles

- Spaceship
- Future orbital craft variants

Space vehicles use:

- low or zero gravity
- momentum
- inertia
- thruster force
- rotation torque
- oxygen or energy pressure
- atmospheric heat
- micro-meteor impacts
- gravity wells
- low friction movement

Space example:

- If a side thruster is damaged, the ship may spin or drift.
- If shield panels break, debris and meteors cause more damage.

## Physics Systems

The game should feel physical and reactive. Every vehicle should have different values for:

- mass
- thrust
- grip
- drag
- lift
- armor
- stability
- fuel use
- heat generation
- repair tolerance

The physics should include:

- gravity
- friction
- drag
- lift
- thrust
- momentum
- inertia
- rotation
- collision impact
- hard landing damage
- overheating
- fuel pressure
- damaged-part instability

Bad repairs should affect the physics:

- bad wheel: wobble and lower grip
- bad wing patch: lower lift
- bad rotor blade: unstable helicopter
- bad thruster: spaceship spin
- bad shield: more hazard damage
- bad pipe: fuel or oxygen loss

## Natural Disasters And Hazards

Disasters appear randomly and get harder over time.

### Ground Hazards

- Earthquake
- Flood
- Sandstorm
- Meteor shower
- Landslide
- Ice storm
- Tornado
- Mud
- Rocks

### Air Hazards

- Thunderstorm
- Lightning
- Turbulence
- Cyclone
- Volcanic ash
- Engine icing
- Air debris

### Space Hazards

- Asteroid field
- Solar flare
- Gravity well
- Debris storm
- Radiation burst
- Oxygen leak
- Engine plasma surge

## Drawing Repair System

The drawing system is the signature feature.

When a part fails:

1. The game shows the broken part name.
2. A faint guide shape appears on the drawing canvas.
3. The player draws a replacement part.
4. The player installs it.
5. The game scores the sketch using shape coverage, stroke amount, balance, and rough size.
6. The repair becomes part of the vehicle behavior.

Repair quality should affect:

- part health
- vehicle health restored
- how long the repair lasts
- wobble or instability
- fuel loss
- heat gain
- disaster resistance

Parts by vehicle type:

Ground parts:

- wheel
- gear
- axle
- spring
- armor plate
- pipe
- chain

Air parts:

- wing patch
- propeller
- rotor blade
- rudder
- jet nozzle
- fuel pipe
- stabilizer

Space parts:

- thruster
- shield panel
- oxygen pipe
- solar panel
- antenna
- reactor coil
- heat tile

## Money And Progression

The player earns coins while surviving.

Coin sources:

- time survived
- distance traveled
- disasters survived
- successful repairs
- clean drawings
- collecting coins during the run
- reaching new best scores
- risky movement bonuses later

Coins are spent in the garage between runs.

## Upgrades

### Universal Upgrades

- engine power
- armor
- stability
- repair quality
- fuel capacity
- heat resistance
- disaster warning time
- coin multiplier
- part durability
- drawing canvas size
- emergency heal efficiency

### Ground Upgrades

- tire grip
- suspension
- brake strength
- torque
- chassis strength

### Air Upgrades

- lift
- thrust
- wing strength
- fuel efficiency
- turbulence resistance
- heat resistance

### Space Upgrades

- thruster power
- shield strength
- oxygen capacity
- reactor efficiency
- heat tiles
- navigation stability

## Healing

The vehicle can heal during a run and between runs.

Healing sources:

- emergency heal button
- repair kits collected during runs
- good drawings
- garage upgrades
- future checkpoint garages
- future self-repair system

The current prototype uses:

- vehicle HP
- part HP
- repair kits
- emergency heal that spends run coins

## Current Prototype Features

The first browser prototype includes:

- static HTML, CSS, and JavaScript
- garage screen
- vehicle selection
- ground, air, and space vehicle categories
- gravity, friction, lift, drag, thrust, fuel, heat, and stability
- disasters by vehicle type
- debris hazards
- coin, fuel, and repair pickups
- random part failures
- repair drawing canvas
- repair guide shapes
- repair quality scoring
- emergency heal
- run coins
- persistent bank coins
- upgrades for engine, armor, stability, and repair
- best score tracking per vehicle

## Controls

- W or Up: thrust / climb / accelerate
- S or Down: brake / descend
- A or Left: rotate or balance left
- D or Right: rotate or balance right
- Space: boost
- Mouse or touch: draw repair parts

## Prototype Roadmap

### Next Short-Term Tasks

1. Improve vehicle art so each vehicle type looks more distinct.
2. Add stronger terrain variety.
3. Add visible damage effects on the vehicle.
4. Make part repairs appear on the vehicle after installation.
5. Add a better scoring model for drawing specific part shapes.
6. Add sound effects and impact feedback.
7. Add mobile touch controls.

### Mid-Term Tasks

1. Add more vehicles.
2. Add unlockable vehicle classes.
3. Add more upgrade types.
4. Add disaster warning indicators.
5. Add run missions.
6. Add vehicle-specific parts.
7. Add animated disaster effects.
8. Add an in-run pause menu.

### Long-Term Tasks

1. Add procedural worlds.
2. Add boss-like disaster events.
3. Add stronger drawing recognition.
4. Add saved custom parts.
5. Add vehicle loadouts.
6. Add daily challenge runs.
7. Add leaderboard support.
8. Add a polished start menu and settings screen.

## Design Direction

PatchDrive should feel like a chaotic repair-survival arcade game. The player should always be doing one of three things:

- controlling the machine
- reacting to disaster
- drawing repairs under pressure

The game should be forgiving enough that bad repairs still work briefly, but risky enough that better drawings and upgrades matter.


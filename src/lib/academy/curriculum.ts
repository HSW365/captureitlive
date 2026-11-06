import type { SportId, TierId } from "./sports";

export interface Lesson {
  id: string; sport: SportId; tier: TierId; n: number;
  title: string; goal: string;
  drills: string[]; mistakes: string[];
  film: string; seconds: number;
  rubric: string[];
}

// [title, goal, drills(3), mistakes(2), film instruction, rubric(3)]
type Row = [string, string, string[], string[], string, string[]];
type Tiers = Record<TierId, Row[]>;

const DATA: Record<SportId, Tiers> = {
  basketball: {
    basic: [
      ["Stance and Ball Control", "Stay low and control the ball with fingertips.", ["Ball slaps, 30 sec", "Figure eights around the legs, 5 rounds", "Stationary pound dribble each hand, 3x30 sec"], ["Palming the ball", "Standing up straight"], "Side view, full body. Dribble 20 reps each hand.", ["Knees bent, head up", "Fingertip control", "Ball stays below the waist"]],
      ["Layup Footwork", "Right-left-up finish on both sides.", ["Slow-motion steps, 10 each side", "Layups off the backboard, 10 each side", "Two-step finish at game speed, 8 each side"], ["Wrong foot takeoff", "Pushing the ball instead of laying it up"], "Angle behind the basket. 6 layups, 3 per side.", ["Correct takeoff foot", "Ball off the board softly", "Balanced landing"]],
      ["Form Shooting", "Build a repeatable shot from close range.", ["One-hand form shots, 15 reps", "Close-range shots, 20 reps", "Elbow-in follow-through holds, 10 reps"], ["Elbow flaring out", "No follow-through"], "Side view, waist up. 10 shots from 5 feet.", ["Elbow under the ball", "Wrist snap and hold", "Arc on the shot"]],
    ],
    varsity: [
      ["Crossover and Change of Pace", "Beat a defender with speed change.", ["Low crossover, 3x20", "In-and-out dribble, 3x15 each hand", "Hesitation moves, 10 each side"], ["Wide, slow crossover", "Looking down at the ball"], "Front view, full body. 8 moves at game speed.", ["Ball stays tight and low", "Head up", "Explosive first step after the move"]],
      ["Catch and Shoot", "Be ready to shoot the moment the ball arrives.", ["Hop-step catch, 15 reps", "Spot shooting 5 spots x 5 shots", "Relocation shots, 10 reps"], ["Dipping the ball", "Landing off balance"], "Side view. 10 catch-and-shoot attempts.", ["Feet set on arrival", "Shot pocket is quick", "Balanced finish"]],
      ["Defensive Slides", "Stay in front of your man.", ["Slide drill baseline to baseline, 4 trips", "Closeout and slide, 10 reps", "Mirror a partner or cone line, 3x30 sec"], ["Crossing the feet", "Standing up in the slide"], "Front view, full body. 4 lengths of the court or 20 feet.", ["Wide base", "Feet never cross", "Hands active"]],
    ],
    pro: [
      ["Pick and Roll Reads", "Read the defender and make the right decision.", ["Dribble-hand pick and roll, 10 reps", "Pocket pass, 10 reps", "Shot off the screen, 10 reps"], ["Rushing the screen", "Predictable decisions"], "Wide angle. 6 pick and roll reps with cones.", ["Set up the defender", "Change of pace off the screen", "Correct read and finish"]],
      ["Finishing Through Contact", "Score with a defender on you.", ["Euro step, 10 each side", "Contact layup with pad, 10 each side", "Floater, 10 each side"], ["Avoiding contact", "Flat-footed finish"], "Behind-the-basket angle. 6 contact finishes.", ["Strong body control", "Protect the ball", "Soft touch finish"]],
      ["Game-Speed Shooting", "Hit shots under fatigue.", ["Run-and-shoot circuit, 5 rounds", "Make 10 free throws after sprints", "Pull-up off the dribble, 10 each hand"], ["Short arc when tired", "Skipping the routine"], "Side view. 10 shots after a 30-second sprint.", ["Form holds under fatigue", "Consistent routine", "Makes or good misses"]],
    ],
  },
  volleyball: {
    basic: [
      ["Platform Passing", "Pass to target with a flat platform.", ["Wall passes, 3x30", "Partner or wall bump to target, 20 reps", "Move and pass, 15 reps"], ["Swinging the arms", "Platform angled wrong"], "Side view. 15 passes to a target.", ["Platform steady and flat", "Legs drive the ball", "Controlled pass height"]],
      ["Overhand Setting", "Quiet hands and a clean set.", ["Wall sets, 3x20", "Set from a toss, 15 reps", "Set to a target, 15 reps"], ["Carrying the ball", "Hands too wide"], "Front view, head and hands. 15 sets.", ["Triangle hand shape", "Extend through the ball", "Even spin"]],
      ["Underhand and Overhand Serve", "Get the serve in with a plan.", ["Toss only, 20 reps", "Serve to zones, 15 reps", "Serve under pressure, 10 reps"], ["Toss drifting", "Slapping with a loose hand"], "Side view. 10 serves.", ["Toss placed consistently", "Contact with a firm hand", "Serve lands in"]],
    ],
    varsity: [
      ["Approach and Hit", "Use a three-step approach for power.", ["Footwork without a ball, 10 reps", "Approach and jump, 10 reps", "Hit off a toss, 12 reps"], ["Late arm swing", "Short last step"], "Side view. 8 approaches.", ["Correct step rhythm", "Arm draw back and swing", "Landing balanced"]],
      ["Serve Receive", "Pass accurately off a tough serve.", ["Pass from a toss, 20 reps", "Pass to target after move, 15 reps", "Call the ball drill, 10 reps"], ["Reaching with the arms", "Late footwork"], "Side view. 12 serve receives.", ["Ready position early", "Move to the ball", "Pass lands near target"]],
      ["Blocking Footwork", "Move and seal the net.", ["Side-step and close, 10 each side", "Cross-over step block, 10 each side", "Block jump timing, 10 reps"], ["Reaching across the net", "Late jump"], "Front view at the net. 8 block reps.", ["Hands pressed over", "Close the gap", "Timing on the jump"]],
    ],
    pro: [
      ["Jump Serve", "Add velocity and control.", ["Toss and approach, 15 reps", "Jump serve to zones, 15 reps", "Serve rotation game, 10 reps"], ["Toss too low", "Poor landing"], "Side view. 8 jump serves.", ["Consistent toss", "Full arm swing", "Serve in with pace"]],
      ["Hitting Lines and Angles", "Hit to targets, not just hard.", ["Line and angle hits, 12 each", "Off-speed shot, 10 reps", "Hit around the block, 10 reps"], ["Hitting only one spot", "Swinging off balance"], "Wide angle. 10 hits to called targets.", ["Variety of shots", "Arm speed", "Lands in the target zone"]],
      ["Defense and Transition", "Dig and attack in one flow.", ["Dig and recover, 15 reps", "Dive and roll, 10 reps", "Dig then approach, 10 reps"], ["Staying too tall", "Slow recovery"], "Side view. 8 dig-to-attack reps.", ["Low base", "Platform out in front", "Quick transition"]],
    ],
  },
  track: {
    basic: [
      ["Running Posture", "Run tall and relaxed.", ["A-skips, 3x20m", "Wall lean drill, 3x15 sec", "Easy strides, 4x50m"], ["Heel striking hard", "Arms crossing the body"], "Side view. 40m stride.", ["Tall posture", "Arms at 90 degrees", "Quiet foot strike"]],
      ["Block Start Basics", "Explode out of the start.", ["Set position holds, 10 reps", "Start for 10m, 6 reps", "Start for 20m, 6 reps"], ["Standing up too early", "Slow first step"], "Side view. 5 starts.", ["Good set position", "Drive phase angle", "Smooth acceleration"]],
      ["Relay Handoff", "Pass the baton cleanly.", ["Standing handoffs, 10 reps", "Jog handoffs, 10 reps", "Full speed handoffs, 6 reps"], ["Looking back too much", "Early reach"], "Side view with a partner. 5 handoffs.", ["Clear call", "Palm up hand", "No drop"]],
    ],
    varsity: [
      ["Drive Phase and Acceleration", "Build speed gradually.", ["Wall drives, 3x10 sec", "Sled or hill sprints, 6x20m", "Accel runs, 5x30m"], ["Popping up", "Overstriding early"], "Side view. 30m acceleration.", ["Body angle", "Powerful push", "Steady rise"]],
      ["Top-End Speed", "Hold form at max speed.", ["Fly 20m, 6 reps", "High knees and butt kicks, 3x20m", "Stride out, 4x60m"], ["Tight shoulders", "Reaching foot strike"], "Side view. 2 fly runs.", ["Relaxed face and hands", "Foot under hips", "Consistent stride"]],
      ["Curve and Race Tactics", "Run efficiently around a turn.", ["Curve run, 6x60m", "Tempo run to build pace, 4x200m", "Race simulation 300m"], ["Drifting wide", "Surging too early"], "Wide angle on a turn. 100m curve run.", ["Lean into the curve", "Even pace", "Strong finish"]],
    ],
    pro: [
      ["Race Start and First Ten", "Win the first 10 meters.", ["Reaction starts, 8 reps", "Blocks to 30m, 6 reps", "Starts with a competitor"], ["Early rise", "Pushing with one leg"], "Side view. 4 block starts.", ["Reaction", "Drive angle", "Clean transition"]],
      ["Speed Endurance", "Hold form when it hurts.", ["Repeat 150s with rest, 4x", "Hill repeats, 6x", "Tempo 300s, 3x"], ["Form breakdown", "Tight face"], "Side view. Last 100m of a hard rep.", ["Form holds at the end", "Relaxed shoulders", "Finishes strong"]],
      ["Finish Line Lean", "Use the dip to win close races.", ["Lean drill, 8 reps", "Finish sprint, 6 reps", "Race the clock, 3 reps"], ["Slowing before the line", "Reaching too early"], "Side view at the line. 4 finishes.", ["Full speed through the line", "Controlled lean", "Balance after"]],
    ],
  },
  golf: {
    basic: [
      ["Grip and Setup", "A neutral grip and athletic posture.", ["Grip check, 10 reps", "Setup routine, 10 reps", "Ball position ladder, 10 reps"], ["Strong or weak grip", "Hunched posture"], "Face-on view, full body. 5 setups.", ["Neutral grip", "Hip hinge posture", "Balanced weight"]],
      ["The Half Swing", "Hip high to hip high with a square face.", ["Hip-high backswing hold, 10 reps", "Half swings, 15 reps", "Half swings to target, 10 reps"], ["Arms only", "Rushed tempo"], "Down-the-line view. 8 half swings.", ["Toe up at hip high", "Body rotation", "Even tempo"]],
      ["Putting Stroke", "A pendulum stroke on line.", ["Gate drill, 10 reps", "Three-foot circle, 8 reps", "Distance ladder, 6 reps"], ["Wristy stroke", "Head moving"], "Face-on view, waist up. 6 putts.", ["Shoulders rock", "Head still", "Smooth acceleration"]],
    ],
    varsity: [
      ["Swing Plane", "Stay on plane at the top and in transition.", ["Alignment stick drill, 10 reps", "Top-of-swing check, 10 reps", "Slow-motion swings, 8 reps"], ["Too inside going back", "Over the top"], "Down-the-line view. 6 swings.", ["On plane going back", "Square at the top", "Shallow transition"]],
      ["Tempo and Rhythm", "A smooth three-to-one swing tempo.", ["Pause at top swings, 10 reps", "Count tempo swings, 10 reps", "Feet-together swings, 10 reps"], ["Quick from the top", "Falling off balance"], "Face-on view. 6 full swings.", ["Smooth transition", "Stays centered", "Holds the finish"]],
      ["Chipping and Pitching", "Control distance around the green.", ["Chips to a towel, 10 reps", "Clock system pitches, 10 reps", "One-club ladder, 6 reps"], ["Scooping", "Decelerating"], "Face-on view. 8 shots.", ["Hands ahead", "Weight forward", "Accelerates through"]],
    ],
    pro: [
      ["Shot Shaping", "Hit a draw and a fade on purpose.", ["Draw setup and swing, 8 reps", "Fade setup and swing, 8 reps", "Alternating shapes, 6 reps"], ["Manipulating with the hands", "No pre-shot plan"], "Down-the-line view. 3 draws and 3 fades.", ["Path changes, not hands", "Controlled curve", "Committed to the shot"]],
      ["Speed Training", "Add club-head speed safely.", ["Overspeed swings, 5 reps", "Step-through swings, 5 reps", "Ground force jumps, 5 reps"], ["Losing balance", "Arms only swings"], "Face-on view. 5 max-speed swings.", ["Ground force", "Balanced finish", "Hips lead hands"]],
      ["Pressure Putting", "Make putts when it counts.", ["Start-line gate drill, 10 reps", "Lag to a three-foot circle, 6 reps", "Make 10 in a row from four feet"], ["Decelerating", "Skipping the routine"], "Face-on view. 10 pressure putts.", ["Start line", "Speed control", "Same routine every time"]],
    ],
  },
  tennis: {
    basic: [
      ["Ready Position and Split Step", "Be ready to move to any ball.", ["Split step shadow, 3x20", "Partner ball feed, 10 reps", "React to a call, 10 reps"], ["Flat feet", "Late split step"], "Front view, full body. 15 split steps.", ["Athletic stance", "Split step on timing", "First step quick"]],
      ["Forehand Basics", "Smooth swing and balanced contact.", ["Shadow swings, 20 reps", "Drop-hit to a wall, 20 reps", "Rally to a wall, 20 reps"], ["Arm only swing", "Contact too close to the body"], "Side view. 10 forehands.", ["Prepare early", "Contact in front", "Finish across the body"]],
      ["Backhand Basics", "One or two hands with a stable base.", ["Shadow swings, 20 reps", "Drop-hit to a wall, 20 reps", "Rally to a wall, 20 reps"], ["Late preparation", "Wrist breaking"], "Side view. 10 backhands.", ["Shoulder turn", "Contact in front", "Smooth finish"]],
    ],
    varsity: [
      ["Serve Toss and Motion", "A repeatable toss and rhythm.", ["Toss only, 20 reps", "Serve motion slow, 15 reps", "Serve to boxes, 15 reps"], ["Toss behind the head", "Rushing the swing"], "Side view. 10 serves.", ["Consistent toss", "Racquet drop", "Contact at full reach"]],
      ["Topspin and Depth", "Hit deep with margin.", ["Cross-court rally, 20 reps", "Target depth line, 15 reps", "Rally to a wall with a line"], ["Hitting flat", "Falling short"], "Side view. 12 groundstrokes.", ["Low to high swing", "Lands deep", "Consistent shape"]],
      ["Volleys and Net Play", "Punch the volley with a firm wrist.", ["Wall volleys, 3x20", "Partner volleys, 15 reps", "Approach and volley, 10 reps"], ["Swinging at it", "Dropping the head"], "Front view. 10 volleys.", ["Short backswing", "Firm wrist", "Step into it"]],
    ],
    pro: [
      ["Serve Variety", "Flat, slice and kick with a plan.", ["Flat serve, 10 reps", "Slice serve, 10 reps", "Kick serve, 10 reps"], ["Same toss for all", "No target"], "Side view. 3 of each.", ["Toss variations", "Spin on contact", "Placement"]],
      ["Return of Serve", "Neutralize and take control.", ["Block returns, 15 reps", "Chip returns, 15 reps", "Aggressive returns, 10 reps"], ["Big swing", "Late prep"], "Side view. 10 returns.", ["Short backswing", "Contact in front", "Deep and safe"]],
      ["Point Patterns", "Build points, not just shots.", ["Cross-court then down the line, 10 reps", "Inside-out forehand, 10 reps", "Approach and finish, 10 reps"], ["Going for too much", "No plan"], "Wide angle. 6 patterns.", ["Clear pattern", "Patience", "Finishing the point"]],
    ],
  },
  boxing: {
    basic: [
      ["Stance and Guard", "Balanced stance with hands protecting the chin.", ["Stance holds, 3x30 sec", "Shadow footwork, 3x1 min", "Guard and shuffle, 3x1 min"], ["Feet too close", "Hands dropping"], "Front and side view. 1 min of shadowboxing.", ["Balanced stance", "Chin tucked", "Hands up"]],
      ["Jab and Cross", "Straight punches with full rotation.", ["Slow jab, 3x20", "Jab-cross combination, 3x20", "Jab to a target, 3x30"], ["Dropping the hand after the jab", "Leaning in"], "Side view. 20 jab-cross reps.", ["Straight line", "Hip rotation on the cross", "Returns to guard"]],
      ["Slipping and Moving", "Defend without losing balance.", ["Slip drill, 3x20", "Shadow slip, 3x1 min", "Move and jab, 3x1 min"], ["Straight leg slip", "Looking away"], "Front view. 1 min of slips.", ["Bend the knees", "Eyes forward", "Return to guard"]],
    ],
    varsity: [
      ["Hooks and Uppercuts", "Short, tight power punches.", ["Hook drill, 3x20", "Uppercut drill, 3x20", "Three-punch combinations, 3x1 min"], ["Winding up", "Dropping the guard"], "Front view. 20 combinations.", ["Compact punches", "Weight transfer", "Guard returns"]],
      ["Footwork and Angles", "Create openings by moving.", ["Pivot drill, 3x1 min", "Step and angle, 3x1 min", "Circle the cone drill, 3x1 min"], ["Crossing the feet", "Standing flat"], "Wide angle. 1 min of footwork.", ["Wide base", "Smooth pivots", "Always facing the target"]],
      ["Defense and Counters", "Block, slip and respond.", ["Block and counter, 3x1 min", "Slip and counter, 3x1 min", "Roll under, 3x1 min"], ["Only defending", "Late counter"], "Front view. 1 min of counters.", ["Clean defense", "Fast counter", "Back to guard"]],
    ],
    pro: [
      ["Combination Flow", "String punches smoothly.", ["Four-punch combos, 3x1 min", "Six-punch combos, 3x1 min", "Free flow, 3x2 min"], ["Pausing between punches", "Poor balance"], "Front view. 2 min of free flow.", ["Rhythm", "Balance", "Power and accuracy"]],
      ["Ring Control", "Dictate the pace and distance.", ["Cut-off angle drill, 3x1 min", "Range control with a partner or cone", "Feint and step, 3x1 min"], ["Chasing", "Predictable movement"], "Wide angle. 2 min of ring control.", ["Controls distance", "Feints", "Stays balanced"]],
      ["Conditioning Rounds", "Keep your form when tired.", ["3 rounds x 3 min shadowboxing", "Bag rounds, 3x3 min", "Finishing sprint rounds, 3x30 sec"], ["Dropping the guard", "Slowing the feet"], "Front view. Last 60 seconds of a round.", ["Hands stay up", "Technique holds", "Keeps moving"]],
    ],
  },
  kungfu: {
    basic: [
      ["Horse Stance", "A strong stable stance.", ["Hold 3x30 sec", "Stance to stance transitions, 10 reps", "Horse stance punches, 20 reps"], ["Knees collapsing in", "Leaning forward"], "Front view, full body. 30 second hold and 10 punches.", ["Thighs parallel", "Back straight", "Steady breath"]],
      ["Bow Stance and Basic Strikes", "Move with balance and power.", ["Bow stance holds, 3x20 sec", "Step and punch, 15 reps each side", "Block and punch, 15 reps each side"], ["Narrow stance", "Weak chambering"], "Side view. 10 step-and-punch reps each side.", ["Stable stance", "Hip drives the strike", "Sharp finish"]],
      ["Basic Kicks", "Front and side kicks with control.", ["Front kick, 10 each leg", "Side kick, 10 each leg", "Kick and return to stance, 10 each leg"], ["Leaning back", "Dropping the leg"], "Side view. 8 kicks each leg.", ["Knee chamber", "Controlled extension", "Balance on return"]],
    ],
    varsity: [
      ["Form Sequence One", "Link stances and strikes into a short form.", ["Break the form into sections", "Slow practice, 5 reps", "Full speed, 3 reps"], ["Rushing", "Losing the stance"], "Front view. Perform the full form once.", ["Stance clarity", "Flow between moves", "Finishing posture"]],
      ["Balance and Kicking Combinations", "Chain kicks with stability.", ["Front-side kick combo, 10 each", "Single-leg balance holds, 3x20 sec", "Kick and spin, 8 each side"], ["Wobbling", "Skipping the chamber"], "Side view. 8 combinations.", ["Balance", "Height control", "Clean landing"]],
      ["Power Generation", "Use the whole body to hit.", ["Waist twist drills, 3x20", "Punch from the root, 3x20", "Palm strikes to a pad, 3x20"], ["Arm only power", "Stiff body"], "Front view. 15 power strikes.", ["Root and rotation", "Relaxed to sharp", "Controlled recovery"]],
    ],
    pro: [
      ["Advanced Form", "Perform a longer form with intent.", ["Section drilling", "Slow and fast contrast", "Full form with timing"], ["No expression", "Uneven pace"], "Front view. Perform the full form.", ["Rhythm and timing", "Precision", "Presence and power"]],
      ["Spinning and Jumping Kicks", "Add dynamic movement safely.", ["Spin kick drill, 8 each side", "Jump front kick, 8 reps", "Jump spin kick progression"], ["Spinning off balance", "Poor landing"], "Wide angle. 6 dynamic kicks.", ["Controlled spin", "Height", "Soft balanced landing"]],
      ["Applied Combinations", "Use techniques in sequence.", ["Block-strike-kick, 10 reps", "Partner or pad drill, 3x1 min", "Shadow fight, 3x1 min"], ["Predictable pattern", "Weak guard"], "Front view. 1 min of applied combinations.", ["Flow", "Distance control", "Balance"]],
    ],
  },
  stretching: {
    basic: [
      ["Neck, Shoulders and Spine", "Open the upper body safely.", ["Neck rolls, 5 each way", "Cat-cow, 10 reps", "Shoulder opener, 3x20 sec"], ["Bouncing in a stretch", "Forcing range"], "Front or side view. 2 minute flow.", ["Smooth breathing", "Gentle range", "Hold with control"]],
      ["Hips and Hamstrings", "Improve hip mobility for movement.", ["Hip flexor stretch, 3x30 sec each", "Hamstring stretch, 3x30 sec each", "Figure-four stretch, 3x30 sec each"], ["Rounding the back", "Holding the breath"], "Side view. Hold each for 30 seconds.", ["Neutral spine", "Slow breathing", "Even both sides"]],
      ["Ankles and Calves", "Better push-off and landing.", ["Ankle circles, 10 each way", "Calf stretch, 3x30 sec each", "Toe raises, 15 reps"], ["Heel lifting", "Bouncing"], "Side view. 2 minute routine.", ["Heel down", "Full range", "Control"]],
    ],
    varsity: [
      ["Dynamic Warm-up", "Prepare to play.", ["Leg swings, 10 each", "Walking lunges with a twist, 10 each", "High knees and butt kicks, 3x20m"], ["Going too fast", "Skipping the warm-up"], "Wide angle. Full 3 minute warm-up.", ["Controlled movement", "Full range", "Smooth rhythm"]],
      ["Deep Hip Mobility", "Open the hips for power.", ["90/90 switches, 10 reps", "Deep squat hold, 3x30 sec", "Pigeon pose, 3x30 sec each"], ["Collapsing the chest", "Forcing depth"], "Front view. 2 minute mobility.", ["Upright chest", "Heels flat when possible", "Slow breathing"]],
      ["Thoracic and Shoulder Mobility", "Rotate and reach overhead.", ["Thread the needle, 10 each", "Wall slides, 15 reps", "Open book, 10 each"], ["Lifting the ribs", "Shrugging"], "Front view. 2 minute routine.", ["Controlled rotation", "Stable core", "Smooth breath"]],
    ],
    pro: [
      ["Flexibility Flow", "Link stretches in a continuous routine.", ["Sun salutation variations, 5 rounds", "Lunge with a twist flow, 5 each", "Deep lunge hold, 3x30 sec each"], ["Skipping breaths", "Rushing"], "Front view. 4 minute flow.", ["Breath linked to movement", "Smooth transitions", "Good alignment"]],
      ["Splits Progression", "Build range gradually and safely.", ["Half split, 3x30 sec each", "Frog stretch, 3x30 sec", "Supported side split, 3x30 sec"], ["Forcing it", "Locking the knee"], "Front view. Hold your deepest comfortable position.", ["Square hips", "Controlled depth", "Calm face and breath"]],
      ["Recovery Routine", "Cool down and reduce soreness.", ["Foam roll or self massage, 5 min", "Static holds, 5 min", "Breath reset, 2 min"], ["Rushing through", "Overstretching sore areas"], "Wide angle. Full recovery routine.", ["Slow pace", "Full-body coverage", "Breath control"]],
    ],
  },
  meditation: {
    basic: [
      ["Breath Awareness", "Notice the breath without changing it.", ["Count 10 breaths, 3 rounds", "Belly breath, 3 minutes", "Body scan, 5 minutes"], ["Trying to force calm", "Slouching"], "Front view. Sit for 3 minutes.", ["Upright and relaxed", "Slow breathing", "Stillness"]],
      ["Box Breathing", "Steady the nerves before competition.", ["4-4-4-4 breathing, 5 rounds", "Box breathing, 3 minutes", "Box breathing with eyes closed, 3 minutes"], ["Holding too long", "Tense shoulders"], "Front view. 3 minute session.", ["Equal counts", "Relaxed shoulders", "Even breath"]],
      ["Focus on One Point", "Train attention.", ["Candle or dot focus, 3 minutes", "Breath at the nose, 3 minutes", "Reset when distracted, 3 minutes"], ["Judging the mind", "Moving a lot"], "Front view. 3 minute focus session.", ["Stillness", "Gentle refocus", "Calm face"]],
    ],
    varsity: [
      ["Pre-game Visualization", "See the performance before it happens.", ["Visualize a perfect rep, 3 minutes", "Include sounds and feelings, 3 minutes", "Visualize resetting after a mistake, 3 minutes"], ["Vague images", "Only seeing success"], "Front view. 4 minute visualization.", ["Detailed imagery", "Calm breathing", "Positive end state"]],
      ["Reset After Mistakes", "Move on in seconds.", ["Breath and cue word, 10 reps", "Reset routine, 10 reps", "Practice with a mistake scenario"], ["Dwelling", "Negative self-talk"], "Front view. Demonstrate your reset routine.", ["Clear routine", "Calm breathing", "Focus back on the task"]],
      ["Body Scan and Tension Release", "Relax what you don't need.", ["Progressive muscle relaxation, 5 minutes", "Scan from head to toe, 5 minutes", "Release on exhale, 3 minutes"], ["Rushing", "Falling asleep"], "Front view. 5 minute session.", ["Slow pace", "Releasing tension", "Alert and calm"]],
    ],
    pro: [
      ["Pressure Training", "Stay calm in big moments.", ["Breath under pressure, 3 minutes", "Visualize high-stakes scenarios, 5 minutes", "Cue word under stress, 5 reps"], ["Panic breathing", "Over-thinking"], "Front view. 5 minute session.", ["Steady breath", "Clear focus", "Confident posture"]],
      ["Flow State Prep", "Create a routine that gets you in the zone.", ["Build a 60 second pre-performance routine", "Practice the routine daily", "Add music or a cue"], ["Changing the routine", "Overcomplicating it"], "Front view. Show your routine.", ["Consistent routine", "Calm start", "Focused finish"]],
      ["Gratitude and Mindset", "Train a resilient mindset.", ["Write 3 wins, 3 minutes", "Gratitude breath, 3 minutes", "Set an intention, 2 minutes"], ["Negative focus", "Skipping the practice"], "Front view. 3 minute session.", ["Sincerity", "Calm", "Clear intention"]],
    ],
  },
};

export const LESSONS: Lesson[] = (Object.keys(DATA) as SportId[]).flatMap((sport) =>
  (Object.keys(DATA[sport]) as TierId[]).flatMap((tier) =>
    DATA[sport][tier].map((r, i) => ({
      id: `${sport}-${tier}-${i + 1}`, sport, tier, n: i + 1,
      title: r[0], goal: r[1], drills: r[2], mistakes: r[3], film: r[4], rubric: r[5],
      seconds: sport === "meditation" ? 180 : 45,
    }))
  )
);
export const lessonsFor = (sport: SportId, tier?: TierId) =>
  LESSONS.filter((l) => l.sport === sport && (!tier || l.tier === tier));
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);

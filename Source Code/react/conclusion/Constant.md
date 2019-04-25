# Constant

```javascript



// TypeOfMode
export const NoContext = 0b000;
export const ConcurrentMode = 0b001;
export const StrictMode = 0b010;
export const ProfileMode = 0b100;

// WorkPhase
const NotWorking = 0;
const BatchedPhase = 1;
const LegacyUnbatchedPhase = 2;
const FlushSyncPhase = 3;
const RenderPhase = 4;
const CommitPhase = 5;

// priorityLevel
export const ImmediatePriority: ReactPriorityLevel = 99;
export const UserBlockingPriority: ReactPriorityLevel = 98;
export const NormalPriority: ReactPriorityLevel = 97;
export const LowPriority: ReactPriorityLevel = 96;
export const IdlePriority: ReactPriorityLevel = 95;
export const NoPriority: ReactPriorityLevel = 90;

// expiration time
MAX_SIGNED_31_BIT_INT = 1073741823
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1;
NoWork = 0;
Never = 1;
Sync = MAGIC_NUMBER_OFFSET

```
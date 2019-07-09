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
export const ImmediatePriority = 99;
export const UserBlockingPriority = 98;
export const NormalPriority = 97;
export const LowPriority = 96;
export const IdlePriority = 95;
export const NoPriority = 90;

// expiration time
MAX_SIGNED_31_BIT_INT = 1073741823; // V8在32位系统上的最大整形值 Math.pow(2, 30) - 1
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1;
NoWork = 0;
Never = 1;
Sync = MAGIC_NUMBER_OFFSET;

const NoContext = /*                    */ 0b000000;
const BatchedContext = /*               */ 0b000001;
const EventContext = /*                 */ 0b000010;
const DiscreteEventContext = /*         */ 0b000100;
const LegacyUnbatchedContext = /*       */ 0b001000;
const RenderContext = /*                */ 0b010000;
const CommitContext = /*                */ 0b100000;

// RootTag
export type RootTag = 0 | 1 | 2;
export const LegacyRoot = 0;
export const BatchedRoot = 1;
export const ConcurrentRoot = 2;

// RootExitStatus
type RootExitStatus = 0 | 1 | 2 | 3 | 4;
const RootIncomplete = 0;
const RootErrored = 1;
const RootSuspended = 2;
const RootSuspendedWithDelay = 3;
const RootCompleted = 4;
```

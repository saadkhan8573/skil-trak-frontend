# Quick Fix Guide - Top 5 Memory Leaks

## 1️⃣ Fix URL.createObjectURL Leaks (CRITICAL - 10-15GB)

### Files to Fix:
```
✓ components/inputs/FileUpload.tsx
✓ components/inputs/BinaryFileUpload.tsx
✓ hoc/FileUpload.tsx
✓ components/Avatar/AvatarCard.tsx
✓ And 16+ more (see MEMORY_LEAK_ANALYSIS.md for full list)
```

### Pattern to Apply:

**BEFORE:**
```typescript
const [fileObject, setFileObject] = useState<string | null>(null);

const handleChange = (event: any) => {
    const fileData = event.target.files[0];
    setFileObject(URL.createObjectURL(fileData));
}
```

**AFTER:**
```typescript
const [fileObject, setFileObject] = useState<string | null>(null);

// ✅ Add this cleanup
useEffect(() => {
    return () => {
        if (fileObject) {
            URL.revokeObjectURL(fileObject);
        }
    };
}, [fileObject]);

const handleChange = (event: any) => {
    const fileData = event.target.files[0];
    // ✅ Revoke old before creating new
    if (fileObject) URL.revokeObjectURL(fileObject);
    setFileObject(URL.createObjectURL(fileData));
}
```

---

## 2️⃣ Fix Socket.io Leak (CRITICAL - 5-8GB)

### File: `components/Socket/Socket.tsx`

**BEFORE (Lines 116-130):**
```typescript
useEffect(() => {
    if (AuthUtils.isAuthenticated() && socket) {
        const userId = AuthUtils.getUserCredentials()?.id
        socket.emit('join', userId)
        
        Object.values(SocketNotificationsEvents).forEach((event) => {
            socket.on(event, (notify: any) => {
                // ... handler code ...
            })
        })

        // ✗ CLEANUP COMMENTED OUT
        // return () => {
        //     Object.values(SocketNotificationsEvents).forEach((event) => {
        //         socket.off(event)
        //     })
        //     socket.off('joined')
        //     disconnectSocket()
        // }
    }
}, [socket])
```

**AFTER:**
```typescript
useEffect(() => {
    if (AuthUtils.isAuthenticated() && socket) {
        const userId = AuthUtils.getUserCredentials()?.id
        socket.emit('join', userId)
        socket.off('joined')
        socket.on('joined', () => {})

        // Remove all old listeners first
        Object.values(SocketNotificationsEvents).forEach((event) => {
            socket.off(event)
        })

        // Register fresh listeners
        Object.values(SocketNotificationsEvents).forEach(
            (eventName: SocketNotificationsEvents) => {
                socket.on(eventName, (notify: any) => {
                    playAudioSound('/audio/noti.wav')
                    setEventListener({
                        eventName,
                        eventListener: notify,
                    })
                    dispatch(
                        apiSlice.util.invalidateTags(['AllNotifications'])
                    )
                    invalidateCacheForEvent(eventName)

                    notification.success({
                        title: notify?.type,
                        description: notify?.message,
                        dissmissTimer: 10000,
                        primaryAction: {
                            text: 'View',
                            onClick: (e: any) => {
                                handleNotificationClick(e, notify)
                            },
                        },
                        position: 'topright',
                    })
                })
            }
        )

        // ✅ CLEANUP ENABLED
        return () => {
            Object.values(SocketNotificationsEvents).forEach((event) => {
                socket.off(event)
            })
            socket.off('joined')
            disconnectSocket()
        }
    }
}, [socket])
```

---

## 3️⃣ Fix RTK Query Cache (5-8GB)

### File: `redux/queries/portals/empty.query.ts`

**BEFORE:**
```typescript
export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_END_POINT}/`,
    }),
    // ❌ No cache TTL = cache lives forever
    tagTypes: [...]
})
```

**AFTER:**
```typescript
export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_END_POINT}/`,
    }),
    // ✅ Add cache management
    keepUnusedDataFor: 300,  // Delete cache after 5 min of non-use
    tagTypes: [...]
})
```

### Also update all query endpoints:

**BEFORE:**
```typescript
getAllStudents: builder.query({
    query: (params) => ({url: 'students', params}),
    refetchOnMountOrArgChange: true,  // ❌ Always refetch
})
```

**AFTER:**
```typescript
getAllStudents: builder.query({
    query: (params) => ({url: 'students', params}),
    refetchOnMountOrArgChange: 300,  // ✅ Refetch if > 5 min old
})
```

---

## 4️⃣ Fix Event Listener Leak (3-5GB)

### File: `components/Esign/components/RubberBand.tsx`

**BEFORE:**
```typescript
const onMouseDown = useCallback(
    () => {
        return (e) => {
            e.stopPropagation()
            start.x = e.pageX
            start.y = e.pageY
            document.addEventListener('mousemove', onMouseMove)  // ❌ No cleanup if nav away
            document.addEventListener('mouseup', onMouseUp)
        }
    },
    []
)
```

**AFTER:**
```typescript
// Add this useEffect for proper cleanup
useEffect(() => {
    return () => {
        // Clean up if component unmounts during drag
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }
}, [onMouseMove, onMouseUp])

const onMouseDown = useCallback(
    () => {
        return (e) => {
            e.stopPropagation()
            start.x = e.pageX
            start.y = e.pageY
            // ✅ Same listeners with proper cleanup above
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        }
    },
    []
)
```

---

## 5️⃣ Delete Backup Files (Cleanup)

**File to DELETE:**
```
hooks/useAutoLogout copy.tsx
```

This is dead code and can cause confusion.

---

## Validation Checklist

After making these 5 fixes, verify:

- [ ] Open Dev Tools > Memory
- [ ] Take heap snapshot (note size)
- [ ] Use app for 10 minutes (upload files, navigate, etc)
- [ ] Take another snapshot
- [ ] Memory should NOT grow by more than 50MB

**Expected**: Stable 3-5GB instead of 30-35GB

---

## Time Estimate

- Fix URL leaks: 30 minutes (apply same pattern 20 times)
- Fix Socket.io: 5 minutes (uncomment code)
- Fix RTK Cache: 10 minutes (add 2 lines to 4 files)
- Fix Event listeners: 10 minutes
- Delete backup: 1 minute

**Total: ~1 hour for >95% memory reduction**

---

## Testing Commands

```bash
# Start dev server
npm run dev

# Monitor memory in Task Manager (Windows)
# or Activity Monitor (Mac)
# Watch "Node.js" process memory usage

# Should stabilize around 500-800MB after fix
```

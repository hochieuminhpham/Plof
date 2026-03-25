Components
- Screen
- Header(Used on all Screens)
- Button
- IconButton
- HistoryItem
- Statistic
- SwingPower
- Compass
- Badge
- Input

NavigationStructure:
- Stacks


DatenObjects
- Course
    - Id
    - EndDistance
    - isFinished
    - TargetId
    - UsedShots
    - AllowedShots
- Ball
    - Id
    - xCoord
    - yCoord
- Target
    - Id
    - xCoord
    - yCoord


Zustand & Side-Effects
- Local States (Screen)
- Global-States
    - Course
- API-Interactions
    - Device Sensor (Gyroskop)
    - Accelerometer-Sensor
- Local-Storage-Interactions
    - Save Course
    - Target
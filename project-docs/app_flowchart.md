flowchart TD
  Start[Start] --> AuthCheck{User authenticated?}
  AuthCheck -->|No| AuthPage[Login or Register]
  AuthPage --> AuthCheck
  AuthCheck -->|Yes| RoleSelect{Select user role}
  RoleSelect -->|Business Owner| OwnerDashboard[Business Owner Dashboard]
  RoleSelect -->|Permit Manager| ManagerDashboard[Permit Manager Dashboard]
  RoleSelect -->|Admin| AdminDashboard[Admin Dashboard]
  RoleSelect -->|System Admin| SysAdminDashboard[System Admin Dashboard]

  OwnerDashboard --> OwnerBusiness[Business Module]
  OwnerBusiness --> BusinessCRUD[CRUD Business]
  OwnerBusiness --> BusinessGeo[Address Geocoding]
  OwnerBusiness --> BusinessDoc[Document Upload]
  OwnerDashboard --> OwnerPermits[Permit Tracking]
  OwnerPermits --> PermitCRUD[CRUD Permits]
  OwnerPermits --> PermitDoc[Document Upload]
  OwnerPermits --> PermitStatus[Status Badges]
  OwnerDashboard --> OwnerDocs[Unified Documents]
  OwnerDashboard --> OwnerNotifications[Notifications]
  OwnerDashboard --> OwnerSettings[Settings]

  ManagerDashboard --> ManagerOwners[Business Owner Module]
  ManagerOwners --> OwnerCRUD2[CRUD Owners]
  ManagerOwners --> OwnerDoc2[Document Upload]
  ManagerOwners --> OwnerVerify[Verification Wizard]
  ManagerDashboard --> ManagerBusinesses[Business Module]
  ManagerBusinesses --> BusinessCRUD2[CRUD Business]
  ManagerBusinesses --> BusinessDoc2[Document Upload]
  ManagerBusinesses --> BusinessVerify[Verification Wizard]
  ManagerDashboard --> ManagerPermits[Permit Tracking]
  ManagerPermits --> PermitCRUD2[CRUD Permits]
  ManagerPermits --> PermitDoc2[Document Upload]
  ManagerPermits --> PermitStatus2[Status Badges]
  ManagerDashboard --> ManagerDocs[Unified Documents]
  ManagerDashboard --> Subscription[Subscription Billing]
  ManagerDashboard --> ManagerNotifications[Notifications]
  ManagerDashboard --> ManagerSettings[Settings]

  AdminDashboard --> AdminUsers[User and Role Management]
  AdminDashboard --> AdminSettings[Settings]

  SysAdminDashboard --> SysSettings[System Settings]
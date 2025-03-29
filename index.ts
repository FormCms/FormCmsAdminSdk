// entity data management pages
export type {XEntity} from './types/xEntity'
export type {DataItemPageConfig} from "./cms/pages/useDataItemPage";
export {useDataItemPage,getDefaultDataItemPageConfig} from "./cms/pages/useDataItemPage";

export type {DataListPageConfig}  from "./cms/pages/useDataListPage";
export {useDataListPage,getDefaultDataListPageConfig} from "./cms/pages/useDataListPage";

export type {NewDataItemPageConfig} from "./cms/pages/userNewDataItemPage";
export {userNewDataItemPage,getDefaultNewDataItemPageConfig} from "./cms/pages/userNewDataItemPage";


// asset management
export  type { AssetListPageConfig } from "./cms/pages/useAssetListPage";
export  { useAssetListPage,getDefaultAssetListPageConfig } from "./cms/pages/useAssetListPage";
export {useAssetEditPage} from "./cms/pages/useAssetEditPage";


//auth and account management pages
export {useUserInfo} from "./auth/services/auth";

export type {UseChangePasswordPageConfig} from "./auth/pages/useChangePasswordPage";
export {useChangePasswordPage,getDefaultUseChangePasswordPageConfig} from "./auth/pages/useChangePasswordPage";

export type {UseLoginPageConfig} from "./auth/pages/useLoginPage";
export {useLoginPage,getDefaultUseLoginPageConfig} from "./auth/pages/useLoginPage";

export type {UseRegisterPageConfig} from "./auth/pages/useRegisterPage";
export {useRegisterPage,getDefaultUseRegisterPageConfig} from "./auth/pages/useRegisterPage";

export type {UseRoleDetailPageConfig} from "./auth/pages/useRoleDetailPage";
export {useRoleDetailPage,getDefaultUseRoleDetailPageConfig} from "./auth/pages/useRoleDetailPage";

export type {UseRoleListPageConfig} from "./auth/pages/useRoleListPage";
export {useRoleListPage,getDefaultUseRoleListPageConfig} from "./auth/pages/useRoleListPage";

export type {UseUserDetailPageConfig} from "./auth/pages/useUserDetailPage";
export {useUserDetailPage,getDefaultUseUserDetailPageConfig} from "./auth/pages/useUserDetailPage";

export type {UseUserListPageConfig} from "./auth/pages/useUserListPage";
export {useUserListPage,getDefaultUseUserListPageConfig} from "./auth/pages/useUserListPage";

//system task
export type {TaskListPageConfig} from "./cms/pages/useTaskListPage"
export {useTaskListPage,getDefaultTaskListPageConfig} from "./cms/pages/useTaskListPage";

//audit log
export {useAuditLogListPage} from "./auditLog/pages/useAuditLogListPage";
export {useAuditLogDetailPage} from "./auditLog/pages/useAuditLogDetailPage";

//global component config
export type {CmsComponentConfig} from "./cms/types/cmsComponentConfig";
export {getDefaultCmsComponentConfig} from "./cms/types/cmsComponentConfig";

//configuration
export {setCmsApiBaseUrl} from "./cms/configs";
export {setAuditLogBaseUrl} from "./auditLog/config";
export {setAuthApiBaseUrl} from "./auth/configs";

//menu and layout
export type {SystemMenuLabels} from "./hooks/useMenuItems"
export {useUserProfileMenu, useAssetMenuItems, useEntityMenuItems, useSystemMenuItems} from "./hooks/useMenuItems";
export {EntityRouter} from "./cms/EntityRouter";
export {AccountRouter} from "./auth/AccountRouter";
export {AuditLogRouter} from "./auditLog/AuditLogRouter";
export {AuthRouter} from "./auth/AuthRouter";


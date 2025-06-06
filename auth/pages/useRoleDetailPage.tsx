import {
    deleteRole,
    saveRole,
    useEntities,
    useSingleRole,
} from "../services/accounts";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { createConfirm } from "../../hooks/createConfirm";
import { New } from "./useRoleListPage";
import { FetchingStatus } from "../../containers/FetchingStatus";
import {getEntityPermissionInputs} from "../types/entityPermissionInputs";
import { useCheckError } from "../../hooks/useCheckError";
import {ComponentConfig} from "../../ComponentConfig";
import {AuthComponentConfig} from "../authComponentConfig";

export interface RoleDetailPageConfig {
    deleteConfirmHeader:string
    deleteConfirmationMessage: string;
    deleteSuccessMessage: string;
    saveSuccessMessage: string;
    nameLabel: string;
    nameIsRequiredMessage:string
}

export function getDefaultUseRoleDetailPageConfig(): RoleDetailPageConfig {
    return {
        deleteConfirmHeader:"Confirm",
        deleteConfirmationMessage: "Do you want to delete this role?",
        deleteSuccessMessage: "Delete Succeed",
        saveSuccessMessage: "Save Succeed",
        nameLabel: "Name",
        nameIsRequiredMessage: "Name is required",
    };
}

export function useRoleDetailPage(
    componentConfig :ComponentConfig & AuthComponentConfig,
    baseRouter: string,
    pageConfig: RoleDetailPageConfig = getDefaultUseRoleDetailPageConfig(),
) {
    const { name } = useParams();
    const { data: roleData, isLoading: loadingRole, error: errorRole, mutate: mutateRole } = useSingleRole(
        name === New ? "" : name!
    );
    const { data: entities, isLoading: loadingEntity, error: errorEntities } = useEntities();
    const { confirm, Confirm } = createConfirm("roleDetailPage",componentConfig);
    const { handleErrorOrSuccess, CheckErrorStatus } = useCheckError(componentConfig);
    const { register, handleSubmit, control } = useForm();
    const isNewRole = name === New;
    const formId = "roleDetailPage";

    return { isNewRole, roleData, formId, handleDelete, RoleDetailPageMain };

    async function handleDelete() {
        confirm(pageConfig.deleteConfirmationMessage, pageConfig.deleteConfirmHeader,async () => {
            const { error } = await deleteRole(name!);
            await handleErrorOrSuccess(error, pageConfig.deleteSuccessMessage, () => {
                window.location.href = baseRouter + "/roles/";
            });
        });
    }

    async function onSubmit(formData: any) {
        if (name !== New) {
            formData.name = name;
        }
        const { error } = await saveRole(formData);
        await handleErrorOrSuccess(error,  pageConfig.saveSuccessMessage, () => {
            if (name === New) {
                window.location.href = baseRouter + "/roles/" + formData.name;
            } else {
                mutateRole();
            }
        });
    }

    function RoleDetailPageMain() {
        const entityPermissionInputs = getEntityPermissionInputs(componentConfig.entityPermissionLabels);
        const MultiSelectInput = componentConfig.inputComponents.multiSelect;

        return (
            <>
                <FetchingStatus isLoading={loadingRole || loadingEntity} error={errorRole || errorEntities} componentConfig={componentConfig} />
                <Confirm />
                <CheckErrorStatus />
                <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                    <div className="formgrid grid">
                        {isNewRole && (
                            <div className={"field col-12 md:col-4"}>
                                <label>{pageConfig.nameLabel}</label>
                                <input
                                    type={"text"}
                                    className="w-full p-inputtext p-component"
                                    id={"name"}
                                    {...register("name", { required: pageConfig.nameIsRequiredMessage })}
                                />
                            </div>
                        )}
                        {entityPermissionInputs.map((x) => (
                            <MultiSelectInput
                                data={roleData ?? {}}
                                column={x}
                                register={register}
                                className={"field col-12 md:col-4"}
                                control={control}
                                id={name}
                                options={entities ?? []}
                                key={x.field}
                            />
                        ))}
                    </div>
                </form>
            </>
        );
    }
}
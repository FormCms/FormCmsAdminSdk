import {Button} from "primereact/button";
import {addCollectionItem, useCollectionData} from "../services/entity";
import {EditDataTable} from "../../components/data/EditDataTable";
import {XAttr, XEntity} from "../types/xEntity";
import {useDataTableStateManager} from "../../components/data/useDataTableStateManager";
import {encodeDataTableState} from "../../components/data/dataTableStateUtil";
import {createColumn} from "./createColumn";
import {getFileUploadURL} from "../services/asset";
import {useCheckError} from "../../components/useCheckError";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Dialog} from "primereact/dialog";
import {getInputAttrs, getListAttrs} from "../types/attrUtils";
import {createInput} from "./createInput";
import {useForm} from "react-hook-form";
import {CmsComponentConfig} from "../cmsComponentConfig";

export function EditTable(
    {
        baseRouter,
        column,
        data,
        schema,
        getFullAssetsURL,
        componentConfig
    }: {
        baseRouter: string,
        schema: XEntity,
        column: XAttr,
        data: any,
        getFullAssetsURL: (arg: string) => string
        componentConfig:CmsComponentConfig
    }
) {

    //data
    const targetSchema = column.collection;
    const listAttrs = getListAttrs(targetSchema?.attributes);
    const stateManager = useDataTableStateManager(schema.primaryKey, 8, listAttrs, "");

    const id = (data ?? {})[schema.primaryKey ?? '']
    const { data: collectionData, mutate } = useCollectionData(schema.name, id, column.field, encodeDataTableState(stateManager.state));

    //state
    const [visible, setVisible] = useState(false);

    //ui variables
    const inputAttrs = getInputAttrs(targetSchema?.attributes);
    const dataTableCols = listAttrs.map(x =>
        createColumn(x,componentConfig, getFullAssetsURL, x.field == schema.labelAttributeName ? onEdit : undefined));

    const formId = "edit-table" + column.field;

    //ref
    const navigate = useNavigate();
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();
    const { register, handleSubmit, control } = useForm()

    function onEdit(rowData: any) {
        const id = rowData[targetSchema!.primaryKey];
        const url = `${baseRouter}/${targetSchema!.name}/${id}?ref=${encodeURIComponent(window.location.href)}`;
        navigate(url);
    }

    async function onSubmit(formData: any) {
        const {error} = await addCollectionItem(schema.name, id, column.field, formData);
        await handleErrorOrSuccess(error, componentConfig.editTable.submitSuccess(column.header), () => {
            mutate();
            setVisible(false);
        });
    }


    const footer = (
        <>
            <Button
                label={componentConfig.editTable.cancelButtonLabel}
                icon="pi pi-times"
                outlined
                onClick={() => setVisible(false)}
            />
            <Button
                label={componentConfig.editTable.saveButtonLabel}
                icon="pi pi-check"
                type="submit"
                form={formId}
            />
        </>
    );

    return (
        <div className={'card col-12'}>
            <label id={column.field} className="font-bold">
                {column.header}
            </label><br/>
            <Button
                outlined
                label={componentConfig.editTable.addButtonLabel(column.header)}
                onClick={() => setVisible(true)}
                size="small"
            />
            {' '}
            <EditDataTable
                dataKey={schema.primaryKey}
                columns={dataTableCols}
                data={collectionData}
                stateManager={stateManager}
            />
            <Dialog
                maximizable
                visible={visible}
                onHide={() => setVisible(false)}
                modal
                className="p-fluid"
                footer={footer}
                header={componentConfig.editTable.dialogHeader(column.header)}
            >
                <>
                    <CheckErrorStatus/>
                    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                        <div className="formgrid grid">
                            {
                                inputAttrs.map((column: any) => createInput({
                                    data:{},
                                    column,
                                    register,
                                    control,
                                    id,
                                    uploadUrl:getFileUploadURL(),
                                    getFullAssetsURL,
                                    fullRowClassName:'field col-12',
                                    partialRowClassName:'field col-12 md:col-4'
                                }, componentConfig))
                            }
                        </div>
                    </form>
                </>
            </Dialog>
        </div>
    );
}
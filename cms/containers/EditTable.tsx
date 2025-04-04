import {addCollectionItem, useCollectionData} from "../services/entity";
import {XAttr, XEntity} from "../../types/xEntity";
import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {getFileUploadURL} from "../services/asset";
import {useCheckError} from "../../hooks/useCheckError";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {toDataTableColumns, getInputAttrs, getListAttrs} from "../../types/attrUtils";
import {createInput} from "./createInput";
import {useForm} from "react-hook-form";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {formater} from "../../types/formatter";
import {GeneralComponentConfig} from "../../ComponentConfig";

export function EditTable(
    {
        currentUrl,
        baseRouter,
        column,
        data,
        schema,
        getFullAssetsURL,
        componentConfig
    }: {
        baseRouter: string,
        currentUrl: string,
        schema: XEntity,
        column: XAttr,
        data: any,
        getFullAssetsURL: (arg: string) => string
        componentConfig: CmsComponentConfig & GeneralComponentConfig
    }
) {

    //data
    const targetSchema = column.collection;
    const listAttrs = getListAttrs(targetSchema?.attributes);
    const stateManager = useDataTableStateManager(schema.name,schema.primaryKey, 8, listAttrs, "");

    const id = (data ?? {})[schema.primaryKey ?? '']
    const {
        data: collectionData,
        mutate
    } = useCollectionData(schema.name, id, column.field, encodeDataTableState(stateManager.state));

    //state
    const [visible, setVisible] = useState(false);

    //ui variables
    const dataTableCols = listAttrs.map(x =>
        toDataTableColumns(x, x.field == schema.labelAttributeName ? onEdit : undefined)
    );
    const inputAttrs = getInputAttrs(targetSchema?.attributes);

    const formId = "edit-table" + column.field;
    const LazyDataTable = componentConfig.dataComponents.lazyTable;

    //ref
    const navigate = useNavigate();
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
    const {register, handleSubmit, control, reset} = useForm()
    const Button = componentConfig.etc.button;
    const Dialog = componentConfig.etc.dialog;

    function onEdit(rowData: any) {
        const id = rowData[targetSchema!.primaryKey];
        const url = `${baseRouter}/${targetSchema!.name}/${id}?ref=${encodeURIComponent(currentUrl)}`;
        navigate(url);
    }

    async function onSubmit(formData: any) {
        const {error} = await addCollectionItem(schema.name, id, column.field, formData);
        await handleErrorOrSuccess(error, componentConfig.editTable.submitSuccess(column.header), () => {
            mutate();
            handleClose();
        });
    }

    function handleClose(){
        reset();
        setVisible(false);
    }


    const footer = (
        <>
            <Button
                label={componentConfig.editTable.cancelButtonLabel}
                icon="pi pi-times"
                outlined
                type="button"
                onClick={handleClose}
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
                type="button"
                outlined
                label={componentConfig.editTable.addButtonLabel(column.header)}
                onClick={() => setVisible(true)}
                size="small"
            />
            {' '}
            <LazyDataTable
                dataKey={schema.primaryKey}
                columns={dataTableCols}
                data={collectionData}
                stateManager={stateManager}
                formater={formater}
                getFullAssetsURL={getFullAssetsURL}
            />
            <Dialog
                width={'95%'}
                maximizable
                visible={visible}
                onHide={() => setVisible(false)}
                modal
                className="p-fluid"
                footer={footer}
                header={componentConfig.editTable.dialogHeader(column.header)}
            >
                <CheckErrorStatus/>
                {
                    inputAttrs.length > 0 && <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                        <div className="formgrid grid">
                            {
                                inputAttrs.map((column: any) => createInput({
                                    data: {},
                                    column,
                                    register,
                                    control,
                                    id: undefined,
                                    uploadUrl: getFileUploadURL(),
                                    getFullAssetsURL,
                                    fullRowClassName: 'field col-12',
                                    partialRowClassName: 'field col-12 md:col-4'
                                }, componentConfig))
                            }
                        </div>
                    </form>
                }
            </Dialog>
        </div>
    );
}
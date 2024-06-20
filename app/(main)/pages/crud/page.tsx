/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Projeto } from '@/types';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyMachine = {
        id: '',
        code: '',
        name: '',
        image: '',
        category: '',
        status: 'ATIVO'
    };

    const [machines, setMachines] = useState(null);
    const [machineDialog, setMachineDialog] = useState(false);
    const [deleteMachineDialog, setDeleteMachineDialog] = useState(false);
    const [deleteMachinesDialog, setDeleteMachinesDialog] = useState(false);
    const [machine, setMachine] = useState(emptyMachine);
    const [selectedMachines, setSelectedMachines] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        ProductService.getProducts().then((data) => setMachines(data as any));
    }, []);

    const openNew = () => {
        setMachine(emptyMachine);
        setSubmitted(false);
        setMachineDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMachineDialog(false);
    };

    const hideDeleteMachineDialog = () => {
        setDeleteMachineDialog(false);
    };

    const hideDeleteMachinesDialog = () => {
        setDeleteMachinesDialog(false);
    };

    const saveMachine = () => {
        setSubmitted(true);

        if (machine.name.trim()) {
            let _machines = [...(machines as any)];
            let _machine = { ...machine };
            if (machine.id) {
                const index = findIndexById(machine.id);

                _machines[index] = _machine;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Máquina Atualizada',
                    life: 3000
                });
            } else {
                _machine.id = createId();
                _machines.push(_machine);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Máquina Criada',
                    life: 3000
                });
            }

            setMachines(_machines as any);
            setMachineDialog(false);
            setMachine(emptyMachine);
        }
    };

    const editMachine = (machine) => {
        setMachine({ ...machine });
        setMachineDialog(true);
    };

    const confirmDeleteMachine = (machine) => {
        setMachine(machine);
        setDeleteMachineDialog(true);
    };

    const deleteMachine = () => {
        let _machines = (machines as any)?.filter((val) => val.id !== machine.id);
        setMachines(_machines);
        setDeleteMachineDialog(false);
        setMachine(emptyMachine);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Máquina Deletada',
            life: 3000
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < (machines as any)?.length; i++) {
            if ((machines as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteMachinesDialog(true);
    };

    const deleteSelectedMachines = () => {
        let _machines = (machines as any)?.filter((val) => !(selectedMachines as any)?.includes(val));
        setMachines(_machines);
        setDeleteMachinesDialog(false);
        setSelectedMachines(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Máquinas Deletadas',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _machine = { ...machine };
        _machine['category'] = e.value;
        setMachine(_machine);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _machine = { ...machine };
        _machine[`${name}`] = val;

        setMachine(_machine);
    };

    const onImageUpload = (event) => {
        const file = event.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            let _machine = { ...machine };
            _machine.image = e.target.result;
            setMachine(_machine);
        };
        reader.readAsDataURL(file);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Deletar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedMachines || !(selectedMachines as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" />
                <Button label="Exportar/CSV" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Etiqueta/Código</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Imagem</span>
                <img src={rowData.image} alt={rowData.name} className="shadow-2" width="100" />
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Categoria</span>
                {rowData.category}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.status?.toLowerCase()}`}>{rowData.status}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editMachine(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteMachine(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex justify-content-between">
            <h5 className="m-0">Gerenciar Máquinas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );
    const machineDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={saveMachine} />
        </>
    );
    const deleteMachineDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteMachineDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteMachine} />
        </>
    );
    const deleteMachinesDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteMachinesDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteSelectedMachines} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={machines as any}
                        selection={selectedMachines as any}
                        onSelectionChange={(e) => setSelectedMachines(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="code" header="Etiqueta/Código" sortable body={codeBodyTemplate}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate}></Column>
                        <Column field="image" header="Imagem" body={imageBodyTemplate}></Column>
                        <Column field="category" header="Categoria" body={categoryBodyTemplate} sortable></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate} exportable={false}></Column>
                    </DataTable>

                    <Dialog visible={machineDialog} style={{ width: '450px' }} header="Detalhes da Máquina" modal className="p-fluid" footer={machineDialogFooter} onHide={hideDialog}>
                        {machine.image && (
                            <img
                                src={machine.image}
                                alt={machine.name}
                                width="150"
                                className="mt-0 mx-auto mb-5 block shadow-2"
                            />
                        )}
                        <div className="field">
                            <label htmlFor="code">Etiqueta/Código</label>
                            <InputText
                                id="code"
                                value={machine.code}
                                onChange={(e) => onInputChange(e, 'code')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !machine.code })}
                            />
                            {submitted && !machine.code && <small className="p-error">Etiqueta/Código é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="name">Nome</label>
                            <InputText
                                id="name"
                                value={machine.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !machine.name })}
                            />
                            {submitted && !machine.name && <small className="p-error">Nome é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label className="mb-3">Categoria</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton
                                        inputId="category1"
                                        name="category"
                                        value="A"
                                        onChange={onCategoryChange}
                                        checked={machine.category === 'A'}
                                    />
                                    <label htmlFor="category1">Categoria A</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton
                                        inputId="category2"
                                        name="category"
                                        value="B"
                                        onChange={onCategoryChange}
                                        checked={machine.category === 'B'}
                                    />
                                    <label htmlFor="category2">Categoria B</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton
                                        inputId="category3"
                                        name="category"
                                        value="C"
                                        onChange={onCategoryChange}
                                        checked={machine.category === 'C'}
                                    />
                                    <label htmlFor="category3">Categoria C</label>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <InputText
                                id="status"
                                value={machine.status}
                                onChange={(e) => onInputChange(e, 'status')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !machine.status })}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="image">Imagem</label>
                            <FileUpload name="image" accept="image/*" customUpload uploadHandler={onImageUpload} auto mode="basic" />
                            {machine.image && (
                                <img
                                    src={machine.image}
                                    alt={machine.name}
                                    width="150"
                                    className="mt-0 mx-auto mb-5 block shadow-2"
                                />
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMachineDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteMachineDialogFooter} onHide={hideDeleteMachineDialog}>
                        <div className="confirmation-content flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {machine && (
                                <span>
                                    Tem certeza que deseja deletar <b>{machine.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMachinesDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteMachinesDialogFooter} onHide={hideDeleteMachinesDialog}>
                        <div className="confirmation-content flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {machine && <span>Tem certeza que deseja deletar as máquinas selecionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;

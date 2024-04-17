export default function editEntry({ editEntry, entriesName, tableSqlName, updEditEntry, router, updEditState }) {

    function handleEditClose() {
        updEditEntry({});
        updEditState(false);
    }

    async function handleEditSave() {
        try {
            let answer = null;
            if (editEntry.id) {
                answer = await router.updateEntry(tableSqlName, { data: editEntry });
            } else {
                answer = await router.insertUser({ data: editEntry });
            }
            if (answer?.data?.entry || answer?.data?.ok) {
                window.location.reload();
            }
        } catch (e) {
            console.log(e);
        }

    }

    return (
        <div className='edit-container'>
            {Object.keys(editEntry).map((name, index) => (
                <div>
                    {<span className="atribute-name">{name === 'id' && !editEntry[name] ? '' : entriesName[tableSqlName][name]}</span>}
                    {
                        name === 'id' ?
                            <span>{editEntry[name] ? editEntry[name] : ''}</span>
                            :
                            <>
                                <br></br>
                                <input defaultValue={editEntry[name] ? editEntry[name] : ''}
                                    onChange={(e) => {
                                        const entry = editEntry;
                                        entry[name] = e.target.value;

                                        updEditEntry(entry);
                                    }} />
                            </>
                    }
                </div>
            ))}
            <button onClick={handleEditSave}>Сохранить</button>
            <button onClick={handleEditClose} >Выйти</button>
        </div>
    );
}
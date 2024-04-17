import { createRef, useState } from "react"
import EditEntry from './EditEntry'
import CONSTANTS from '../../modules/constants';
import './activeTable.css';

export default function ActiveTable({ table, router, entries, entriesName }) {
    const [editState, updEditState] = useState(false);
    const [editEntry, updEditEntry] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterName, updFilterName] = useState('');

    const selectRef = createRef(null);

    function addElemHandler(sqlName) {
        if (sqlName === 'tours')
            window.location.replace(`http://${CONSTANTS.PAGE_API}/tours/`)
        else {
            updEditEntry({ id: null, login: null, password: null });
            updEditState(true);
        }
    }

    function handleSelectChange(event) {
        const name = event.currentTarget.value;
        updFilterName(name);
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    function handleEditOpen(index) {
        updEditEntry(entries[index]);
        updEditState(true);
    }

    function handleViewTour(index) {
        if (table.sqlName === 'tours')
            window.location.replace(`http://${CONSTANTS.PAGE_API}/tours/` + entries[index].url)
        else handleEditOpen(index)
    }

    async function handleDeleteEntry(index) {
        try {
            const deleteInfo = await router.deleteEntryById(table.sqlName, entries[index].id);
            if (deleteInfo?.data?.ok) {
                window.location.reload();
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>

            <div className="interactive-container">
                {entries[0] && <select
                    ref={selectRef}
                    onChange={handleSelectChange}
                // Показываем или скрываем выпадающий список в зависимости от состояния
                >
                    {['', ...Object.keys(entries[0])].map((option, index) => (
                        <option className='region' key={index} value={option}>
                            {entriesName[table.sqlName][option]}
                        </option>
                    ))}
                </select>}
                {table?.name && filterName !== '' && <input placeholder="Найти..."
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                />}
                {table?.name && <button onClick={() => addElemHandler(table.sqlName)}>Добавить запись в {table.name}</button>}
            </div>
            {table?.name && <h1>{table.name}</h1>}
            {editState &&
                <EditEntry editEntry={editEntry} entriesName={entriesName}
                    tableSqlName={table.sqlName} updEditEntry={updEditEntry} router={router} updEditState={updEditState} />
            }
            {
                entries[0] &&
                <table>
                    <thead>
                        <tr>
                            {

                                Object.keys(entries[0]).map((key, i) =>
                                    (<th key={key}>{entriesName[table.sqlName][key]}</th>)
                                )

                            }
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            entries.filter((entry) => {
                                if (searchTerm !== '' && filterName !== '') {
                                    if (typeof entry[filterName] === 'string')
                                        return entry[filterName].toLowerCase().includes(searchTerm.toLowerCase())
                                    else return `${entry[filterName]}`.includes(searchTerm)
                                }
                                else return entry
                            }).map((entry, index) => (

                                <tr key={index}>
                                    {Object.values(entry).map((value, i) => (
                                        <td key={i}>{value.length > 20 ? `${value}`.substring(0, 20) + '...' : value}</td>
                                    ))}
                                    <td>
                                        <button onClick={() => { if (!editState) handleEditOpen(index) }}>Редактировать</button>
                                        <button onClick={() => handleDeleteEntry(index)}>Удалить</button>
                                        {table.sqlName === 'tours' &&
                                            <a href={`http://${CONSTANTS.PAGE_API}/tours/` + entries[index].url}>
                                                < button onClick={() => handleViewTour(index)}>Посмотреть</button>
                                            </a>}
                                    </td>
                                </tr>


                            ))
                        }
                    </tbody>
                </table>
            }
        </div >
    )
}
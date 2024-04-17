import { useEffect, useState } from "react";
import TablesMenu from "../components/admin/TablesMenu";
import ActiveTable from "../components/admin/ActiveTable";

import './adminPage.css';

const tables = [
    {},
    { name: 'Пользователи', sqlName: 'users' },
    { name: 'Туры', sqlName: 'tours' }
];

const entriesName = {
    users: { id: 'id', login: 'Логин', password: 'Пароль' },
    tours: {
        id: 'id', name: 'Название', price: 'Цена',
        description: 'Описание', region: 'Регион', city: 'Город',
        photos: 'Фото', url: 'Ссылка'
    }
}

export default function AdminPage({ router, updBackgrColor, updShadowOpacity, updNavBttnColor, updNavShadow }) {
    const [tableIndex, updTableIndex] = useState(0);
    const [entries, updEntries] = useState([]);

    useEffect(() => {
        updShadowOpacity(0);
        updBackgrColor('#f7f7fa');
        updNavBttnColor('#9b6fa3');
        updNavShadow(0.25);
    }, [])

    return (
        <div className="admin-container">
            <TablesMenu tables={tables} router={router} updTableIndex={updTableIndex} updEntries={updEntries} />
            <ActiveTable table={tables[tableIndex]} entriesName={entriesName} router={router} entries={entries} />
        </div>
    );
}
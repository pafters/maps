import { useState } from "react";

export default function TablesMenu({ tables, updTableIndex, router, updEntries }) {

    async function selectTable(sqlName, index) {
        updTableIndex(index);
        const answer = await router.getTable(sqlName);
        updEntries(answer.data.table);
    }

    return (
        <div>
            {tables.map((table, index) => (
                table?.name &&
                <button key={table.name} onClick={(e) => { selectTable(table.sqlName, index); }}>{table.name}</button>
            ))}
        </div>
    )
}
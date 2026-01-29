import { useStockForm } from "@/controllers/form";

import { StockFieldSet } from "./fields/StockFieldSet";
import { InspectorFormWrapper } from "./InspectorFormWrapper";

export function EditStockFormView({ stockId }: { stockId: string }) {
    const { stock, handleCancel, handleDelete } = useStockForm(stockId);
    if (!stock) {
        return null;
    }

    return (
        <InspectorFormWrapper onCancel={handleCancel} onDelete={handleDelete} showDelete>
            <StockFieldSet stockId={stockId} />
        </InspectorFormWrapper>
    );
}

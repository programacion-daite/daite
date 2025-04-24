import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export const RenderEditButton = (params: any) => (
    <Button
        variant="link"
        className="text-blue-500"
        type="button"
        onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Edit button clicked for row:', params.data);
        }}
        data-id={params.data.primaryId || 'id'}
    >
        <Pencil className="h-4 w-4 text-green-600" />
    </Button>
);

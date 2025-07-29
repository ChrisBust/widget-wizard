
import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';
import TestEmbedForm from '@/components/dashboard/test-embed-form';

async function getWidgets() {
    await dbConnect();
    // Fetch all widget data now, not just names
    const widgets = await Widget.find({}).sort({ businessName: 1 });
    return JSON.parse(JSON.stringify(widgets));
}

export default async function TestEmbedPage() {
    const widgets = await getWidgets();

    return (
        <div className="container mx-auto py-6">
            <div className="max-w-4xl mx-auto">
                <TestEmbedForm widgets={widgets} />
            </div>
        </div>
    );
}

import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';
import TestEmbedForm from '@/components/dashboard/test-embed-form';

async function getWidgets() {
    await dbConnect();
    const widgets = await Widget.find({}).select('businessName _id').sort({ businessName: 1 });
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

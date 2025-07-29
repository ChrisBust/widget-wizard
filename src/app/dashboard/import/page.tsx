import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';
import ImportReviewsForm from '@/components/dashboard/import-reviews-form';

async function getWidgets() {
    await dbConnect();
    const widgets = await Widget.find({}).select('businessName _id').sort({ businessName: 1 });
    return JSON.parse(JSON.stringify(widgets));
}

export default async function ImportReviewsPage() {
    const widgets = await getWidgets();

    return (
        <div className="container mx-auto py-6">
            <div className="max-w-2xl mx-auto">
                <ImportReviewsForm widgets={widgets} />
            </div>
        </div>
    );
}

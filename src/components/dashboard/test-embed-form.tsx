
'use client';

import { useState } from 'react';
import type { IWidget } from '@/models/widget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import WidgetView from '@/components/widget/widget-view';

interface TestEmbedFormProps {
  widgets: IWidget[];
}

export default function TestEmbedForm({ widgets }: TestEmbedFormProps) {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const selectedWidget = widgets.find(w => w._id.toString() === selectedWidgetId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Widget Appearance</CardTitle>
          <CardDescription>
            Select a widget to render a preview of its appearance. This page directly renders the component to avoid localhost script-loading issues. Use the "Embed Code" button on the dashboard for the production script.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="widgetId">Select Widget</Label>
            <Select onValueChange={setSelectedWidgetId}>
                <SelectTrigger id="widgetId">
                    <SelectValue placeholder="Select a widget to test..." />
                </SelectTrigger>
                <SelectContent>
                {widgets.map(widget => (
                    <SelectItem key={widget._id.toString()} value={widget._id.toString()}>
                        {widget.businessName}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {selectedWidget && (
        <>
            <Separator />
            <Card>
                <CardHeader>
                    <CardTitle>Widget Preview</CardTitle>
                    <CardDescription>The selected widget is rendered below. You can interact with it as a user would.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <WidgetView widget={selectedWidget} />
                    </div>
                </CardContent>
            </Card>
        </>
      )}
    </div>
  );
}

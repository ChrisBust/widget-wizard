
'use client';

import { useState, useEffect } from 'react';
import type { IWidget } from '@/models/widget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface TestEmbedFormProps {
  widgets: Pick<IWidget, '_id' | 'businessName'>[];
}

export default function TestEmbedForm({ widgets }: TestEmbedFormProps) {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleWidgetChange = (widgetId: string) => {
    setSelectedWidgetId(widgetId);
    setIframeKey(Date.now()); 
  };
  
  const iframeSrc = selectedWidgetId ? `${origin}/widget/${selectedWidgetId}` : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Widget Embed</CardTitle>
          <CardDescription>
            Select a widget to render it below using an iframe. This allows you to test its functionality in a controlled environment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="widgetId">Select Widget</Label>
            <Select onValueChange={handleWidgetChange}>
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
      
      {selectedWidgetId && (
        <>
            <Separator />
            <Card>
                <CardHeader>
                    <CardTitle>Embedded Widget</CardTitle>
                    <CardDescription>The selected widget is rendered below. You can interact with it as a user would.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div id="widget-container" className="p-4 border rounded-lg bg-muted/20 min-h-[700px]">
                        <iframe 
                            key={iframeKey}
                            src={iframeSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 'none', minHeight: '650px', borderRadius: '8px' }}
                            title="Widget Preview"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
      )}
    </div>
  );
}


'use client';

import { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  
  useEffect(() => {
    if (selectedWidgetId && containerRef.current) {
      // Clear previous widget
      containerRef.current.innerHTML = '';
      
      // Create widget tag
      const widgetTag = document.createElement('review-widget');
      widgetTag.setAttribute('widgetId', selectedWidgetId);
      widgetTag.setAttribute('data-api-base', origin);
      containerRef.current.appendChild(widgetTag);
      
      // Check if script already exists to avoid duplicates
      const existingScriptId = 'review-widget-script';
      let script = document.getElementById(existingScriptId) as HTMLScriptElement;
      
      if (script) {
        // If script exists, remove and re-add to re-trigger execution
        script.remove();
      }

      // Create and append the script tag
      script = document.createElement('script');
      script.id = existingScriptId;
      // NOTE: In a real app, you would point this to your actual CDN URL.
      // For local testing, we point to the public file.
      script.src = `/review-widget.js?v=${Date.now()}`; // Add version query to bust cache
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

  }, [selectedWidgetId, origin]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Widget Embed</CardTitle>
          <CardDescription>
            Select a widget to render it below using the custom element and script. This simulates how it would appear on an external site.
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
      
      {selectedWidgetId && (
        <>
            <Separator />
            <Card>
                <CardHeader>
                    <CardTitle>Embedded Widget</CardTitle>
                    <CardDescription>The selected widget is rendered below. You can interact with it as a user would.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div id="widget-container" ref={containerRef} className="p-4 border rounded-lg bg-muted/20 min-h-[700px]">
                      {/* The widget will be dynamically injected here */}
                    </div>
                </CardContent>
            </Card>
        </>
      )}
    </div>
  );
}

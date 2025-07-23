
'use client';

import { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function EmbedCodeButton({ widgetId }: { widgetId: string }) {
  const [hasCopiedWidget, setHasCopiedWidget] = useState(false);
  const [hasCopiedScript, setHasCopiedScript] = useState(false);
  
  const loaderScriptSrc = `https://cdn.jsdelivr.net/gh/ChrisBust/studio@latest/public/review-widget.v2.js?v=${new Date().getTime()}`;

  const widgetTag = `<review-widget widgetId="${widgetId}"></review-widget>`;
  const scriptCode = `<script src="${loaderScriptSrc}" async defer><\/script>`;

  const copyToClipboard = (text: string, type: 'widget' | 'script') => {
    navigator.clipboard.writeText(text);
    if (type === 'widget') {
        setHasCopiedWidget(true);
      setTimeout(() => setHasCopiedWidget(false), 2000);
    } else {
        setHasCopiedScript(true);
      setTimeout(() => setHasCopiedScript(false), 2000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex-1">
          <Code className="mr-2 h-4 w-4" />
          Embed Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Embed Your Widget</DialogTitle>
          <DialogDescription>
            Follow these two steps to embed your widget on your website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="widget-tag" className='flex items-center'>
              <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center mr-2">1</span>
              Paste this tag in your site where the widget should appear.
            </Label>
            <div className="relative">
              <pre className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap break-all">
                <code>{widgetTag}</code>
              </pre>
              <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={() => copyToClipboard(widgetTag, 'widget')}>
                {hasCopiedWidget ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy Widget Tag</span>
              </Button>
            </div>
          </div>
           <div className="grid w-full items-center gap-2">
            <Label htmlFor="script-code" className='flex items-center'>
                <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center mr-2">2</span>
                Paste this script once per page, just before the closing &lt;/body&gt; tag.
            </Label>
            <div className="relative">
                <pre className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap break-all">
                    <code>{scriptCode}</code>
                </pre>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={() => copyToClipboard(scriptCode, 'script')}>
                    {hasCopiedScript ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy Script Code</span>
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

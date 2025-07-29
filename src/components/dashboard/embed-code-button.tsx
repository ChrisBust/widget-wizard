
'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';

export default function EmbedCodeButton({ widgetId }: { widgetId: string }) {
  const [hasCopied, setHasCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // This ensures window is defined, runs only on client
    setOrigin(window.location.origin);
  }, []);
  
  const iframeSrc = `${origin}/widget/${widgetId}`;
  const embedCode = `<iframe src="${iframeSrc}" width="100%" height="700px" style="border:none; border-radius: 8px;"></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
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
            Copy and paste this code into your website's HTML where you want the widget to appear.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="embed-code" className='flex items-center'>
                Embed Iframe
            </Label>
            <div className="relative">
              <pre className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap break-all">
                <code>{embedCode}</code>
              </pre>
              <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={() => copyToClipboard(embedCode)}>
                {hasCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy Embed Code</span>
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

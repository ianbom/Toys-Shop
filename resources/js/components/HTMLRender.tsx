import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type HTMLRenderProps = {
    html: string | null | undefined;
    className?: string;
    emptyFallback?: ReactNode;
};

const hasHtmlTag = /<\/?[a-z][\s\S]*>/i;

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normalizeHtml(value: string) {
    const trimmed = value.trim();

    if (trimmed === '') {
        return '';
    }

    if (!hasHtmlTag.test(trimmed)) {
        return trimmed
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => `<p>${escapeHtml(line)}</p>`)
            .join('');
    }

    return trimmed
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, '')
        .replace(/\s+(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '');
}

export default function HTMLRender({
    className,
    emptyFallback = null,
    html,
}: HTMLRenderProps) {
    const safeHtml = useMemo(() => normalizeHtml(html ?? ''), [html]);

    if (!safeHtml) {
        return emptyFallback;
    }

    return (
        <div
            className={cn(
                'space-y-3 text-sm leading-7 text-zinc-700',
                '[&_a]:font-semibold [&_a]:text-[#9A6B45] [&_a]:underline [&_a]:underline-offset-4',
                '[&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:bg-zinc-50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-zinc-600',
                '[&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-zinc-800',
                '[&_h1]:text-2xl [&_h1]:leading-tight [&_h1]:font-semibold [&_h1]:text-zinc-950',
                '[&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-semibold [&_h2]:text-zinc-900',
                '[&_mark]:rounded-sm [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:text-zinc-950',
                '[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5',
                '[&_p]:m-0',
                '[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-950 [&_pre]:p-4 [&_pre]:text-zinc-50',
                '[&_strong]:font-semibold [&_strong]:text-zinc-900',
                '[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5',
                className,
            )}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    );
}

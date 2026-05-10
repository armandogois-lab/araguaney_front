'use client';

import { useState } from 'react';
import { InvestorList } from './investor-list';
import { InvestorCreateForm } from './investor-create-form';
import type { InvestorSummary } from '@/lib/types/investor';

interface Props {
  onSelect: (investor: InvestorSummary) => void;
}

type Tab = 'existente' | 'nuevo';

export function Step1Investor({ onSelect }: Props) {
  const [tab, setTab] = useState<Tab>('existente');

  return (
    <div className="flex flex-col gap-4 px-7 py-6">
      <div className="border-border-subtle flex items-center gap-1 self-start rounded-md border p-1">
        <TabBtn current={tab} value="existente" onClick={setTab}>
          Existente
        </TabBtn>
        <TabBtn current={tab} value="nuevo" onClick={setTab}>
          Nuevo
        </TabBtn>
      </div>
      {tab === 'existente' ? (
        <InvestorList onSelect={onSelect} />
      ) : (
        <InvestorCreateForm onCreated={onSelect} />
      )}
    </div>
  );
}

function TabBtn({
  current,
  value,
  onClick,
  children,
}: {
  current: Tab;
  value: Tab;
  onClick: (t: Tab) => void;
  children: React.ReactNode;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      role="tab"
      data-state={active ? 'active' : 'inactive'}
      onClick={() => onClick(value)}
      className={
        'rounded px-3 py-1 text-[12px] font-medium transition-colors ' +
        (active ? 'bg-foreground text-background' : 'text-text-2 hover:bg-subtle')
      }
    >
      {children}
    </button>
  );
}

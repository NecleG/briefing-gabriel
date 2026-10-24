"use client";
export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  return <form action={action} onSubmit={(e) => { if (!confirm("Excluir este briefing definitivamente? Esta ação não pode ser desfeita.")) e.preventDefault(); }}>
    <button className="btn-ghost border-red-300/50 text-red-300">Excluir briefing</button></form>;
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { HelpCircle, Download, Pencil, MousePointerClick, FileText, User } from "lucide-react";

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-transparent border-white/20 text-white hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400"
          title="Ajuda"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1e293b] border-white/10 text-white max-h-[80vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-400" />
            Como Usar o Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Feature 1 */}
          <div className="p-4 bg-[#0f172a] rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Relatório Geral de Vendas (PNG)</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Baixe um relatório completo consolidado com todas as informações de desempenho:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold shrink-0">1.</span>
                    <span>Clique em "<strong className="text-white">Relatório Geral</strong>" (botão azul) na seção de relatórios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold shrink-0">2.</span>
                    <span>O download do relatório será iniciado automaticamente em formato PNG</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold shrink-0">3.</span>
                    <span>O relatório inclui: métricas gerais, progresso da meta, desempenho por unidade e ranking completo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-4 bg-[#0f172a] rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Relatório Individual por Vendedor (PNG)</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Baixe relatórios personalizados para cada vendedor:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold shrink-0">1.</span>
                    <span>Selecione o vendedor desejado no dropdown ao lado do botão roxo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold shrink-0">2.</span>
                    <span>Clique em "<strong className="text-white">Relatório Individual</strong>" (botão roxo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold shrink-0">3.</span>
                    <span>O download será iniciado automaticamente com: métricas individuais, ranking, histórico e contribuição</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-4 bg-[#0f172a] rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/30">
                <Download className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Download Rápido de Relatório (PNG)</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Baixe relatórios rapidamente direto dos gráficos:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold shrink-0">1.</span>
                    <span><strong className="text-white">No Ranking:</strong> Passe o mouse sobre um vendedor e clique no ícone de download laranja</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold shrink-0">2.</span>
                    <span><strong className="text-white">No Perfil:</strong> Abra o perfil do vendedor e clique em "Baixar Relatório PNG"</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-4 bg-[#0f172a] rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                <Pencil className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Editar Valores de Vendas</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Edite qualquer venda registrada no sistema:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">1.</span>
                    <span>Alterne para o modo "Tabela" usando o botão de visualização</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">2.</span>
                    <span>Clique no ícone <Pencil className="w-3 h-3 inline text-green-400" /> para editar data, vendedor, unidade, quantidade ou valor (R$)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="p-4 bg-[#0f172a] rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Exportar Dados</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Exporte seus dados para análise externa:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">•</span>
                    <span>Clique em "Exportar CSV" para baixar todos os dados filtrados em formato de planilha</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">•</span>
                    <span>O arquivo inclui data, vendedor, unidade, quantidade e valor estimado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <h4 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
              💡 Dicas Rápidas
            </h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Use os filtros globais (mês/ano) para analisar períodos específicos</li>
              <li>• Alterne entre visualização de gráficos e tabela conforme necessário</li>
              <li>• Os relatórios PNG são ideais para apresentações e compartilhamento</li>
              <li>• Todos os dados são salvos localmente no navegador</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
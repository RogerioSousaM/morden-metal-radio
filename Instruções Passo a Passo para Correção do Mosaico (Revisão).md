# Instruções Passo a Passo para Correção do Mosaico (Revisão)

## Problema: Botões e Descrições Ainda Não Aparecem em Spiritbox e Architects

**Análise:**
Após a aplicação das instruções anteriores, foi reportado que os botões e descrições ainda não aparecem corretamente nos cards de Spiritbox e Architects. Uma nova análise do `MosaicGallery.tsx` foi realizada, focando nas seções de botões e descrição.

**Causas Potenciais:**
1.  **Estilos CSS Ausentes/Incorretos:** As classes `btn-primary` e `btn-secondary` podem não estar definidas ou não estarem sendo carregadas corretamente, resultando em botões invisíveis ou com estilo padrão que os torna imperceptíveis.
2.  **Lógica `isLargeCard` para Descrição:** Embora Spiritbox e Architects sejam cards grandes, a condicional `isLargeCard && banda.description` pode estar falhando por algum motivo, ou a descrição pode estar vazia/indefinida para essas bandas.
3.  **Problemas de Layout/Overflow:** Elementos pais podem ter `overflow: hidden` ou alturas fixas que estão cortando o conteúdo dos botões e descrições.

## Soluções Propostas

### 1. Garantir que as Classes de Botão Estão Definidas e Carregadas

**Passo 1.1: Verificar Definição das Classes `btn-primary` e `btn-secondary`**
- As classes `btn-primary` e `btn-secondary` foram copiadas do `Filmaço.tsx`. É crucial que essas classes estejam definidas em um arquivo CSS global (como `globals.css` ou `tailwind.css`) ou em um arquivo de configuração do Tailwind CSS que esteja sendo importado e processado corretamente no projeto.
- **Ação:** Certifique-se de que as definições de `btn-primary` e `btn-secondary` (incluindo cores, padding, etc.) estejam acessíveis e aplicadas ao `MosaicGallery.tsx`. Se o projeto não estiver usando Tailwind CSS, essas classes precisarão ser convertidas para CSS puro ou para o sistema de estilo que o projeto utiliza.

**Exemplo de como as classes deveriam ser (Tailwind CSS):**
```css
.btn-primary {
  @apply bg-metal-orange text-white px-4 py-2 rounded-md font-medium hover:bg-metal-orange/90 transition-colors;
}

.btn-secondary {
  @apply bg-transparent text-metal-orange border border-metal-orange px-4 py-2 rounded-md font-medium hover:bg-metal-orange/10 transition-colors;
}
```

### 2. Revisar a Lógica de Exibição da Descrição

**Passo 2.1: Verificar a Propriedade `description` das Bandas**
- Confirme se os objetos `banda` para Spiritbox e Architects realmente possuem a propriedade `description` preenchida e não vazia ou `undefined`.
- **Ação:** Adicione um `console.log(banda.name, banda.description)` dentro do `BandCard` para verificar o valor da descrição para essas bandas específicas.

**Passo 2.2: Ajustar a Condicional da Descrição (se necessário)**
- A condicional atual é `isLargeCard && banda.description`. Se a descrição estiver presente e `isLargeCard` for `true` para Spiritbox e Architects, a descrição deveria aparecer.
- **Ação:** Se a descrição ainda não aparecer, e você confirmou que `banda.description` tem conteúdo, considere remover temporariamente a condicional `isLargeCard` para testar se a descrição aparece. Se aparecer, o problema está na determinação de `isLargeCard` para essas bandas.

### 3. Ajustar Layout e Overflow

**Passo 3.1: Inspecionar o Container dos Botões**
- O container dos botões é:
  ```jsx
  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
    {/* Botões aqui */}
  </div>
  ```
- **Ação:** Verifique se este `div` ou seus pais têm estilos que podem estar ocultando o conteúdo, como `height: 0`, `overflow: hidden`, ou `position: absolute` sem `top`/`bottom` definidos que o tiram do fluxo normal.

**Passo 3.2: Garantir Espaço Suficiente para o Conteúdo do Card**
- O `div` que contém o título, descrição e botões tem `min-h-[120px]`.
- **Ação:** Aumente temporariamente o `min-h` do `div` do conteúdo do card (ex: `min-h-[200px]`) para ver se os botões e a descrição aparecem. Se aparecerem, o problema é falta de espaço vertical.

### Resumo das Ações Recomendadas

1.  **Verificar e garantir que as classes `btn-primary` e `btn-secondary` estão corretamente definidas e acessíveis no CSS do projeto.** Este é o ponto mais provável de falha.
2.  **Confirmar que as bandas Spiritbox e Architects possuem a propriedade `description` preenchida.**
3.  **Inspecionar o layout dos containers dos botões e do conteúdo do card** para garantir que não há `overflow: hidden` ou restrições de altura que os estejam ocultando. Ajuste `min-h` se necessário.

Ao resolver esses pontos, os botões e descrições deverão aparecer corretamente nos cards de Spiritbox e Architects.


# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## O que é este repositório

Este é um **workspace de produção de conteúdo**, não uma aplicação. Ele guarda material da marca OnCred (uma fintech brasileira de empréstimo) organizado por tipo de trabalho:

- `videos/` — projetos de vídeo, cada subpasta é um projeto independente
- `imagens/` — assets de imagem
- `Executar Claude.app/` — app launcher do Automator (macOS) que abre o Claude Code neste repositório; não é código do projeto

Os comandos e a arquitetura abaixo se referem ao projeto Remotion ativo em `videos/promocional-1/`. Cada projeto futuro em `videos/` tende a seguir o mesmo padrão Remotion.

## Comandos (rodar de dentro de `videos/promocional-1/`)

```console
npm i                                          # instalar dependências
npm run dev                                    # Remotion Studio (preview interativo)
npm run lint                                   # eslint src && tsc (lint + typecheck)
npx remotion render OnCredPromo out/promocional-1.mp4   # renderizar o vídeo final
```

- `OnCredPromo` é o `id` da `Composition` (definido em `src/Root.tsx`); use esse id ao renderizar.
- Não há suíte de testes — `npm run lint` (ESLint + `tsc`) é a verificação de qualidade.
- A pasta `out/` é ignorada pelo Git; o `.mp4` renderizado não é versionado.

## Arquitetura do vídeo (`videos/promocional-1/src/`)

Fluxo de entrada Remotion: `index.ts` → `registerRoot(RemotionRoot)` → `Root.tsx` registra a `<Composition id="OnCredPromo" />` (720×1280, 30fps, 450 frames = 15s) → componente `OnCredPromo` em `OnCredPromo.tsx`.

`OnCredPromo.tsx` contém **todo** o vídeo num único arquivo, estruturado em 4 cenas encadeadas por `<Sequence>` sobre um `<Background>` e `<Audio>` persistentes:

| Cena | Frames | Componente |
|------|--------|------------|
| Gancho ("Precisa de dinheiro rápido?") | 0–96 | `SceneHook` |
| Velocidade ("liberação em 1 HORA") | 96–210 | `SceneSpeed` |
| Desconto na conta de energia | 210–330 | `SceneEnergy` |
| CTA (logo + oncred.com.br) | 330–450 | `SceneCTA` |

Convenções a respeitar ao editar animações:
- As cores da marca são constantes nomeadas no topo (`NAVY_DEEP`, `NAVY`, `GREEN`, `GREEN_LIGHT`, etc.), extraídas do logo oficial. Use-as em vez de hardcodar hex.
- O helper `enter(frame, start, dur)` produz uma transição 0→1 suave (easing `EASE_OUT`); use-o para entradas de elementos.
- O wrapper `<Scene>` faz fade-in/out nas bordas de cada cena — envolva o conteúdo de cada cena com ele e passe `durationInFrames` igual ao da `<Sequence>` correspondente.
- Ao mudar a duração de uma cena, ajuste tanto o `from`/`durationInFrames` da `<Sequence>` em `OnCredPromo` quanto o `durationInFrames` passado ao `<Scene>`, e a envelope de volume do `<Audio>` se o total mudar.

Os assets ficam em `public/` e são carregados via `staticFile(...)`: `logo.svg`, `Montserrat.ttf` (fonte via `@remotion/fonts`), `music-inspiration.mp3` (trilha em uso).

## Qualidade de render (`remotion.config.ts`)

O design é feito em 720×1280 mas renderizado com `setScale(1.5)` → saída 1080×1920. Codec H.264, CRF 16, JPEG quality 100. Não suba a config do design para 1080 diretamente — o scale preserva o layout e dá nitidez.

## Skill disponível

A skill `remotion` (`.claude/skills/remotion/`) contém regras detalhadas de Remotion (animações de texto, timing, áudio, captions, ffmpeg, etc.). Consulte-a ao implementar técnicas de vídeo novas.

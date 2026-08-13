import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { TextArea } from '@/components/ui/textarea'
import { useStore } from '@/store'
import useAIChatStreamHandler from '@/hooks/useAIStreamHandler'
import Icon from '@/components/ui/icon'

const MODEL_OPTIONS = [
  { value: 'qwen2.5:7b', label: 'Qwen 2.5:7B' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' }
]

const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedModel) {
      setSelectedModel('qwen2.5:7b')
    }
  }, [selectedModel, setSelectedModel])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentModel = MODEL_OPTIONS.find(m => m.value === selectedModel) || MODEL_OPTIONS[0]

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex shrink-0 items-center gap-1 px-1 text-[11px] font-medium text-primary/40 transition-colors hover:text-primary/70"
      >
        <span>{currentModel.label}</span>
        <Icon type="chevron-down" size="xxs" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-3 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e21] shadow-xl shadow-black/40 backdrop-blur-sm">
          {MODEL_OPTIONS.map((model) => (
            <button
              key={model.value}
              type="button"
              onClick={() => {
                setSelectedModel(model.value)
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                selectedModel === model.value
                  ? 'bg-white/10 text-primary'
                  : 'text-primary/60 hover:bg-white/5 hover:text-primary/90'
              }`}
            >
              {selectedModel === model.value && (
                <Icon type="check" size="xxs" className="text-positive" />
              )}
              <span className={selectedModel === model.value ? '' : 'pl-[18px]'}>
                {model.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ChatInput = () => {
  const { chatInputRef, agentId, teamId } = useStore()

  const { handleStreamResponse } = useAIChatStreamHandler()
  const [inputMessage, setInputMessage] = useState('')
  const isStreaming = useStore((state) => state.isStreaming)
  const handleSubmit = async () => {
    if (!inputMessage.trim()) return

    const currentMessage = inputMessage
    setInputMessage('')

    try {
      await handleStreamResponse(currentMessage)
    } catch (error) {
      toast.error(
        `Error in handleSubmit: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  return (
    <div className="relative mx-auto mb-1 flex w-full max-w-2xl font-geist">
      {/* Unified input bar */}
      <div className="flex w-full items-end gap-2 rounded-2xl border border-accent bg-primaryAccent p-1.5 pl-4">
        {/* Textarea — takes remaining space */}
        <TextArea
          placeholder={'Décrivez votre projet...'}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.nativeEvent.isComposing &&
              !e.shiftKey &&
              !isStreaming
            ) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="w-full flex-1 resize-none border-none bg-transparent px-0 text-sm text-primary shadow-none outline-none ring-0 placeholder:text-muted focus-visible:border-none focus-visible:ring-0"
          disabled={!(agentId || teamId)}
          ref={chatInputRef as React.Ref<HTMLTextAreaElement>}
        />

        {/* Bottom row: model selector + send button */}
        <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
          <ModelSelector />

          {/* Divider */}
          <div className="h-5 w-px bg-white/10" />

          {/* Send button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !(agentId || teamId) || !inputMessage.trim() || isStreaming
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primaryAccent transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            <Icon type="send" color="primaryAccent" size="xs" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput

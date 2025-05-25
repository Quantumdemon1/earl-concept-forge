
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'

interface ExportButtonProps {
  onClick: () => void
  isExporting: boolean
}

export default function ExportButton({ onClick, isExporting }: ExportButtonProps) {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onClick} 
        size="lg"
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {isExporting ? 'Exporting...' : 'Export Concept'}
      </Button>
    </div>
  )
}

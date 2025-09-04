import { QRCodeSVG } from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  value: string;
  title?: string;
  size?: number;
  className?: string;
}

export function QRCodeGenerator({ 
  value, 
  title = "QR Code", 
  size = 200,
  className = ""
}: QRCodeGeneratorProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "คัดลอกแล้ว",
        description: "ข้อมูลถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถคัดลอกข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className={`text-center ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <QRCodeSVG
            id="qr-code-svg"
            value={value}
            size={size}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
          />
        </div>
        
        <div className="text-xs font-mono text-muted-foreground break-all bg-muted p-2 rounded">
          {value}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex-1"
            data-testid="button-copy-qr"
          >
            <Copy className="w-4 h-4 mr-2" />
            คัดลอก
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex-1"
            data-testid="button-download-qr"
          >
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลด
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
'use client'

import { AlertTriangle, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EscalationBannerProps {
  onFindClinic?: () => void
  onRequestCallback?: () => void
}

export function EscalationBanner({ onFindClinic, onRequestCallback }: EscalationBannerProps) {
  return (
    <Card className="border-warning/50 bg-warning/10">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/20">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">This Case Needs Human Review</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on our analysis, your situation may require personalized legal assistance. 
              We recommend consulting with a legal aid professional for the best guidance.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-devanagari">
                आपकी स्थिति के लिए व्यक्तिगत कानूनी सहायता की आवश्यकता हो सकती है।
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button 
                onClick={onFindClinic}
                className="bg-primary hover:bg-primary/90"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Find Legal Aid Clinic
              </Button>
              <Button 
                variant="outline"
                onClick={onRequestCallback}
              >
                <Phone className="mr-2 h-4 w-4" />
                Request Callback
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

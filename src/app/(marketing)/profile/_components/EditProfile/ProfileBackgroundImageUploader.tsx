import { buttonVariants } from "@/components/ui/Button"
import { IconButtonProps } from "@/components/ui/IconButton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useToast } from "@/components/ui/hooks/useToast"
import { cn } from "@/lib/utils"
import { UploadSimple } from "@phosphor-icons/react"
import Button from "components/common/Button"
import useDropzone from "hooks/useDropzone"
import { Uploader } from "hooks/usePinata/usePinata"
import { PropsWithChildren, useState } from "react"

type Props = {
  uploader: Uploader
  tooltipLabel: string
} & Omit<IconButtonProps, "size" | "rightIcon" | "aria-label">

export const ProfileBackgroundImageUploader = ({
  uploader: { isUploading, onUpload },
  children,
  tooltipLabel,
  icon,
  ...buttonProps
}: PropsWithChildren<Props>): JSX.Element => {
  const [progress, setProgress] = useState<number>(0)
  const { toast } = useToast()
  const showErrorToast = (description: string) =>
    toast({
      variant: "error",
      title: "Couldn't upload image",
      description,
    })

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: false,
    onDrop: (accepted, fileRejections) => {
      setProgress(0)
      if (accepted.length > 0) {
        onUpload({ data: [accepted[0]], onProgress: setProgress })
      }
      if (fileRejections.length > 0)
        showErrorToast(fileRejections[0].errors[0].message)
    },
    onError: (err) => {
      showErrorToast(err.message)
    },
  })

  if (isUploading)
    return (
      <Button {...buttonProps} leftIcon={icon} isDisabled>
        {(progress * 100).toFixed(0)}%
      </Button>
    )

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          {...getRootProps()}
          className={cn(
            buttonVariants({
              ...buttonProps,
              className: [...(buttonProps.className ?? ""), "size-10"],
            })
          )}
        >
          <input {...getInputProps()} hidden />
          {isDragActive ? <UploadSimple weight="bold" /> : icon}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltipLabel}</TooltipContent>
    </Tooltip>
  )
}

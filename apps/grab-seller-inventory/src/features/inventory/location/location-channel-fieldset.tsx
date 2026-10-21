import { Checkbox } from "@khinemyaezin/seller-ui/components/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@khinemyaezin/seller-ui/components/field";
import { resolveLink } from "@khinemyaezin/seller-api";
import { useSalesChannelLink } from "@/features/inventory/api/sales-channel-link";
import { useSalesChannels } from "@/features/inventory/api/use-sales-channels";
import {
  useLinkLocationToChannelMutation,
  useUnlinkLocationFromChannelMutation,
} from "@/features/inventory/api/use-locations";
import type { LocationResponse } from "@/features/inventory/types";
import type { SalesChannelResponse } from "@/features/inventory/types/sales-channel.response";

export function salesChannelLabel(type: string): string {
  if (type === "WEBSITE") return "Website";
  if (type === "MARKETPLACE") return "Marketplace";
  return type;
}

export function isSellerFacingChannel(type: string): boolean {
  return type === "WEBSITE" || type === "MARKETPLACE";
}

export type LocationChannelFieldSetProps = {
  location?: LocationResponse;
};

export function LocationChannelFieldSet({ location }: LocationChannelFieldSetProps) {
  const salesChannelLink = useSalesChannelLink();
  const { data: channels = [] } = useSalesChannels(salesChannelLink);
  const linkMutation = useLinkLocationToChannelMutation();
  const unlinkMutation = useUnlinkLocationFromChannelMutation();

  const linkChannel = resolveLink(location?._links, "link-location-to-channel");
  const unlinkChannel = resolveLink(location?._links, "unlink-location-from-channel");
  const linked = new Set(location?.salesChannelIds ?? []);
  const pending = linkMutation.isPending || unlinkMutation.isPending;
  const rows = channels.filter((channel) => isSellerFacingChannel(channel.type));

  if (!salesChannelLink || !location || rows.length === 0 || (!linkChannel && !unlinkChannel)) {
    return null;
  }

  const toggle = async (channel: SalesChannelResponse, nextChecked: boolean) => {
    if (nextChecked) {
      if (!linkChannel) return;
      await linkMutation.mutateAsync({
        link: linkChannel,
        salesChannelId: channel.salesChannelId,
      });
      return;
    }
    if (!unlinkChannel) return;
    await unlinkMutation.mutateAsync({
      link: unlinkChannel,
      salesChannelId: channel.salesChannelId,
    });
  };

  return (
    <>
      <FieldSeparator className="my-6" />
      <FieldSet>
        <FieldLegend>Sales channels</FieldLegend>
        <FieldDescription>Choose which channels this location can fulfill.</FieldDescription>
        <FieldGroup className="gap-3">
          {rows.map((channel) => {
            const inputId = `location-channel-${channel.salesChannelId}`;
            const checked = linked.has(channel.salesChannelId);
            const canToggle = checked ? !!unlinkChannel : !!linkChannel;
            return (
              <Field key={channel.salesChannelId}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={inputId}
                    checked={checked}
                    disabled={pending || !canToggle}
                    onCheckedChange={(value) => {
                      void toggle(channel, value === true);
                    }}
                  />
                  <FieldLabel htmlFor={inputId}>{salesChannelLabel(channel.type)}</FieldLabel>
                </div>
              </Field>
            );
          })}
        </FieldGroup>
      </FieldSet>
    </>
  );
}

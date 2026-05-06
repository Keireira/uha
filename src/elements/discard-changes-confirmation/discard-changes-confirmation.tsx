import React from 'react';

import { Button, ConfirmationDialog, Text } from '@expo/ui/swift-ui';
import { frame, opacity } from '@expo/ui/swift-ui/modifiers';

type Props = {
	discardLabel?: string;
	isPresented: boolean;
	onDiscard: () => void;
	onIsPresentedChange: (isPresented: boolean) => void;
	title: string;
};

const DiscardChangesConfirmation = ({
	discardLabel = 'Discard Changes',
	isPresented,
	onDiscard,
	onIsPresentedChange,
	title
}: Props) => (
	<ConfirmationDialog
		title={title}
		titleVisibility="visible"
		isPresented={isPresented}
		onIsPresentedChange={onIsPresentedChange}
	>
		<ConfirmationDialog.Trigger>
			<Text modifiers={[frame({ width: 0, height: 0 }), opacity(0)]}> </Text>
		</ConfirmationDialog.Trigger>

		<ConfirmationDialog.Actions>
			<Button role="destructive" label={discardLabel} onPress={onDiscard} />
		</ConfirmationDialog.Actions>
	</ConfirmationDialog>
);

export default DiscardChangesConfirmation;

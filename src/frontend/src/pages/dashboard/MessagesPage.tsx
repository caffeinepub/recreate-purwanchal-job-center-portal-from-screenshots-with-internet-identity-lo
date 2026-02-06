import { useState } from 'react';
import { useGetInbox, useGetSentMessages, useSendMessage } from '../../hooks/queries/useMessages';
import { useGetCallerRole } from '../../hooks/queries/useCallerRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, Inbox, Mail } from 'lucide-react';
import { Principal } from '@dfinity/principal';

export default function MessagesPage() {
  const { data: inbox, isLoading: inboxLoading } = useGetInbox();
  const { data: sent, isLoading: sentLoading } = useGetSentMessages();
  const { data: role } = useGetCallerRole();
  const { mutate: sendMessage, isPending } = useSendMessage();

  const [messageContent, setMessageContent] = useState('');
  const [receiverPrincipal, setReceiverPrincipal] = useState('');

  const isAdmin = role === 'admin';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    let receiver: Principal;
    try {
      receiver = Principal.fromText(receiverPrincipal);
    } catch {
      alert('Invalid principal ID');
      return;
    }

    sendMessage(
      { receiver, content: messageContent },
      {
        onSuccess: () => {
          setMessageContent('');
          setReceiverPrincipal('');
        },
      }
    );
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Messages</h2>
        <p className="text-gray-600">Communicate with {isAdmin ? 'users' : 'administrators'}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message Lists */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="inbox" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="inbox" className="gap-2">
                <Inbox className="w-4 h-4" />
                Inbox
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2">
                <Mail className="w-4 h-4" />
                Sent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox">
              {inboxLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : !inbox || inbox.length === 0 ? (
                <Card className="shadow-md">
                  <CardContent className="py-16 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages</h3>
                    <p className="text-gray-500">Your inbox is empty</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {inbox.map((msg) => (
                    <Card key={msg.id.toString()} className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">From: {msg.sender.toString().slice(0, 20)}...</CardTitle>
                        <CardDescription>{formatDate(msg.sentAt)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent">
              {sentLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : !sent || sent.length === 0 ? (
                <Card className="shadow-md">
                  <CardContent className="py-16 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No sent messages</h3>
                    <p className="text-gray-500">You haven't sent any messages yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sent.map((msg) => (
                    <Card key={msg.id.toString()} className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">To: {msg.receiver.toString().slice(0, 20)}...</CardTitle>
                        <CardDescription>{formatDate(msg.sentAt)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Compose Message */}
        <div>
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Message
              </CardTitle>
              <CardDescription>Compose a new message</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSend} className="space-y-4">
                {isAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="receiver">Receiver Principal *</Label>
                    <Input
                      id="receiver"
                      value={receiverPrincipal}
                      onChange={(e) => setReceiverPrincipal(e.target.value)}
                      required
                      placeholder="Enter principal ID"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    required
                    rows={8}
                    placeholder="Type your message here..."
                    className="resize-none"
                  />
                </div>

                <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                  <Send className="w-4 h-4" />
                  {isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

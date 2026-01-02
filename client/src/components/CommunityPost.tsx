import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface PostAuthor {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  level?: string;
}

interface CommunityPostProps {
  id: string;
  author: PostAuthor;
  title?: string;
  content: string;
  mood?: string;
  imageUrl?: string;
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  featured?: boolean;
  karmaAwarded: number;
  createdAt: Date;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export default function CommunityPost({
  id,
  author,
  title,
  content,
  mood,
  imageUrl,
  location,
  likes,
  comments,
  shares,
  featured = false,
  karmaAwarded,
  createdAt,
  onLike,
  onComment,
  onShare
}: CommunityPostProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'very_happy': return '🤩';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      case 'very_sad': return '😢';
      default: return '';
    }
  };

  const getLevelBadgeColor = (level?: string) => {
    switch (level) {
      case 'Wellness Master': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
      case 'Healing Light': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Wellness Guardian': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Wellness Explorer': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Mindful Beginner': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <Card 
      className={`glassmorphism ${featured ? 'border-l-4 border-sage-500' : ''}`}
      data-testid={`community-post-${id}`}
    >
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={author.profileImageUrl} alt={`${author.firstName} ${author.lastName}`} />
            <AvatarFallback className="bg-gradient-to-r from-sage-500 to-ocean-500 text-white">
              {author.firstName?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-slate-800 dark:text-white" data-testid="post-author">
                {author.firstName} {author.lastName}
              </h3>
              {author.level && (
                <Badge className={getLevelBadgeColor(author.level)} data-testid="author-level">
                  {author.level}
                </Badge>
              )}
              {featured && (
                <Badge className="bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-300" data-testid="featured-badge">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <span data-testid="post-timestamp">{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
              {location && (
                <>
                  <span>•</span>
                  <span data-testid="post-location">{location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          {title && (
            <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-2" data-testid="post-title">
              {title} {getMoodEmoji(mood)}
            </h4>
          )}
          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap" data-testid="post-content">
            {content}
          </p>
          
          {imageUrl && (
            <div className="mt-4 rounded-xl overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Post image" 
                className="w-full h-64 object-cover"
                data-testid="post-image"
              />
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              data-testid="post-like-button"
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isLiked ? 'text-red-500 hover:text-red-600' : 'text-slate-500 hover:text-sage-600'
              }`}
            >
              <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
              <span data-testid="post-likes">{likes + (isLiked ? 1 : 0)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              data-testid="post-comment-button"
              onClick={onComment}
              className="flex items-center space-x-2 text-slate-500 hover:text-ocean-600 transition-colors duration-200"
            >
              <i className="far fa-comment"></i>
              <span data-testid="post-comments">{comments}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              data-testid="post-share-button"
              onClick={onShare}
              className="flex items-center space-x-2 text-slate-500 hover:text-lavender-600 transition-colors duration-200"
            >
              <i className="fas fa-share"></i>
              <span>Share</span>
            </Button>
          </div>
          
          {karmaAwarded > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-amber-500 text-sm font-medium" data-testid="post-karma">
                +{karmaAwarded} Karma
              </span>
              <i className="fas fa-star text-amber-500"></i>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

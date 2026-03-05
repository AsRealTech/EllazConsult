import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { usePost } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";

export function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: post, isLoading } = usePost(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-8 w-24 bg-muted rounded mb-8"></div>
        <div className="h-12 w-3/4 bg-muted rounded mb-6"></div>
        <div className="h-6 w-1/4 bg-muted rounded mb-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist.</p>
        <Link href="/blog">
          <Button variant="outline" className="rounded-xl">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-16 md:py-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to all posts
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium py-4 border-y border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM dd, yyyy') : 'Published recently'}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              NextGen Admin
            </div>
          </div>
        </div>

        <div className="prose prose-lg prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary max-w-none text-foreground">
          {/* Simple rendering for now. In a real app, you might use a markdown renderer or ReactHtmlParser */}
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </div>
    </article>
  );
}

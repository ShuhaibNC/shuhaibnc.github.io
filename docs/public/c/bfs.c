#include <stdio.h>
#include <stdlib.h>
#define MAX 100
void bfs(int graph[MAX][MAX], int visited[MAX], int start, int n) {
    int queue[MAX], front = 0, rear = 0;
    visited[start] = 1;
    queue[rear++] = start;
    printf("BFS Traversal: ");
    while (front < rear) {
        int current = queue[front++];
        printf("%d ", current);
        for (int i = 0; i < n; i++) {
            if (graph[current][i] == 1 && !visited[i]) {
                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }
    printf("\n");
}
int main() {
    int graph[MAX][MAX], visited[MAX] = {0}, n, start;
    printf("Enter the number of vertices: ");
    scanf("%d", &n);
    printf("Enter the adjacency matrix:\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            scanf("%d", &graph[i][j]);
        }
    }
for (int i = 0; i < n; i++) {
        visited[i] = 0;
    }
    printf("Enter the starting vertex: ");
    scanf("%d", &start);
    bfs(graph, visited, start, n);
    return 0;
}

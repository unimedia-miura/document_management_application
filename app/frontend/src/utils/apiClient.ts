export const apiClient = async (
	url: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('accessToken'); // ローカルストレージからトークンを取得

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // トークンが存在する場合のみ Authorization ヘッダーを追加
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers, // 呼び出し元で指定されたヘッダーを上書き
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // トークンが無効な場合はログイン画面にリダイレクト
      window.location.href = '/user/login';
    }
    const errorData = await response.json();
    throw new Error(errorData.error || 'APIリクエストに失敗しました');
  }

  if (response.status === 204) {
    return {};
  }

  return response.json();
};
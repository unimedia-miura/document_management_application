const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
			year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

const displayShippingStatus = (status: number) => {
    switch (status) {
      case 0:
        return '未発送';
      case 1:
        return '発送済み';
      case 2:
        return '配達完了';
      default:
        return '不明';
    }
  };

export { formatDate, displayShippingStatus };